import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PeriodStatusService } from '../periodStatus/period-status.service';
import { Collaborator } from './collaborator.entity';
import * as moment from 'moment';
import { CollaboratorBulkDto } from './dto/collaboratorBulkDto';
import { FilterCollaboratorDto } from './dto/filter-collaborator.dto';
import { handleErrors } from 'src/shared/utils/errors-helper';
import { VacationRequest } from '../vacationRequest/vacation-request.entity';
import { MAX_DAYS_PER_PERIOD } from 'src/core/enumerators';

@Injectable()
export class CollaboratorService {
  constructor(
    private readonly periodStatusService: PeriodStatusService,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
  ) {}

  async findAll(query: FilterCollaboratorDto) {
    let { filter } = query;
    if (!filter) filter = '';

    const collaborators = await this.collaboratorRepo.find({
      relations: ['requests'],
      order: { name: 'ASC' },
      where: { name: Like(`%${filter}%`) },
    });

    return Promise.all(
      collaborators.map(async (col) => {
        const { limitEnterprise } = this.makePeriodLimits(
          col.requests,
          col.hiringdate,
        );

        const period = this.makePeriodRange(col.requests, col.hiringdate);

        const { daysEnjoyed } = this.makePeriodDaysAllowed(
          col.requests,
          period,
        );

        const situation = await this.makePeriodStatus(
          limitEnterprise,
          daysEnjoyed,
        );

        return { ...col, situation };
      }),
    );
  }

  async findRequests(id: string) {
    if (!id) throw handleErrors(id, 'id do colaborador não informado');

    const collaborator = await this.collaboratorRepo.findOne(id, {
      relations: ['requests'],
    });

    const { start, end } = this.makePeriodRange(
      collaborator.requests,
      collaborator.hiringdate,
    );

    const { limitEnterprise, ultimate } = this.makePeriodLimits(
      collaborator.requests,
      collaborator.hiringdate,
    );

    const { daysAllowed, daysEnjoyed, daysBalance } =
      this.makePeriodDaysAllowed(collaborator.requests, { start, end });

    const situation = await this.makePeriodStatus(limitEnterprise, daysEnjoyed);

    const period = {
      start,
      end,
      limitEnterprise,
      ultimate,
      daysAllowed,
      daysEnjoyed,
      daysBalance,
      requests: collaborator.requests.filter(
        (a) =>
          moment(a.finalDate) < moment(end) &&
          moment(a.finalDate) > moment(start),
      ),
      situation,
    };

    return { period };
  }

  private reduceYearRequest(requests: Array<VacationRequest>) {
    return requests
      .filter((c) => c.status === 'approved')
      .reduce(
        (a: any, b: any) => ({
          ...a,
          [moment(b.startDate).year()]: [
            ...(a[moment(b.startDate).year()] || []),
            b,
          ],
        }),
        {},
      );
  }

  private handleRequest(requests: Array<VacationRequest>) {
    const treatRequest = this.reduceYearRequest(requests);

    const countDay = (list: any) =>
      list
        .map((item: any) => moment(item.finalDate).diff(item.startDate, 'day'))
        .reduce((a: any, b: any) => a + b);

    const newRequests = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequests.push({
        year: parseInt(item),
        daysEnjoyed: countDay(treatRequest[item]),
        requests: treatRequest[item],
      });
    });

    return newRequests.sort((a, b) => a.year - b.year);
  }

  private calculeLimitsPeriod(hiringdate: string, year: number) {
    const endPeriod = moment(hiringdate).year(year + 1);

    const limitEnterprise = endPeriod.clone().add(6, 'month');
    const ultimate = endPeriod.clone().add(11, 'month');

    return {
      limitEnterprise: moment(limitEnterprise).format('YYYY-MM-DD'),
      ultimate: moment(ultimate).format('YYYY-MM-DD'),
    };
  }

  private calculeRangePeriod(hiringdate: string, year: number) {
    const start = moment(hiringdate);
    const end = moment(hiringdate);

    start.year(year);
    end.year(year + 1);

    return { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') };
  }

  private calculedYear(requests: Array<VacationRequest>, hiringdate) {
    const lessYearCompany = moment().diff(moment(hiringdate), 'year') === 0;

    // considers the current year if you have less than 1 year in the company
    if (lessYearCompany) {
      return moment().year();
    }

    // considers one year and 3 months for employees who do not have requested vacations
    if (!requests.length) {
      return moment().subtract(15, 'month').year();
    }

    const treatRequest = this.handleRequest(requests);
    let year = moment().year();

    // take the oldest date and highlight it, if the period is in default
    const pendingDate = treatRequest
      .sort((a, b) => a.year - b.year)
      .filter((a) => a.daysEnjoyed < MAX_DAYS_PER_PERIOD)
      .shift();

    // if it doesn't find any request it will return the current year
    if (!pendingDate) return year;

    const oldestDate = pendingDate.requests
      .sort((a, b) => a.startDate - b.startDate)
      .shift().startDate;

    // check if the year of the period is the one found or refers to the year of the previous period
    if (moment(oldestDate).month() < moment(hiringdate).month()) {
      year = pendingDate.year - 1;
    } else {
      year = pendingDate.year;
    }
    return year;
  }

  private makePeriodRange(requests: Array<VacationRequest>, hiringdate) {
    const year = this.calculedYear(requests, hiringdate);

    return this.calculeRangePeriod(hiringdate, year);
  }

  private makePeriodLimits(requests: Array<VacationRequest>, hiringdate) {
    const year = this.calculedYear(requests, hiringdate);

    return this.calculeLimitsPeriod(hiringdate, year);
  }

  private makePeriodDaysAllowed(
    requests: Array<VacationRequest>,
    period: { start: string; end: string },
  ) {
    const daysAllowed = MAX_DAYS_PER_PERIOD;

    let daysEnjoyed = 0;
    let daysBalance = 0;

    if (requests.length) {
      const requestAgroupYear = this.handleRequest(requests);

      const requestCurrent = requestAgroupYear.find(
        (request) => request.year === period.start,
      );

      daysEnjoyed = requestCurrent ? requestCurrent.daysEnjoyed : 0;
    }

    daysBalance = daysAllowed - daysEnjoyed;

    return {
      daysAllowed,
      daysEnjoyed,
      daysBalance,
    };
  }

  private async makePeriodStatus(limitEnterprise, daysEnjoyed) {
    const situations = await this.periodStatusService.findAll();
    let situation;
    let gossip = 0;

    if (daysEnjoyed === MAX_DAYS_PER_PERIOD) {
      situation = situations
        .sort((a, b) => a.limitMonths - b.limitMonths)
        .slice(-1)[0];

      return Promise.resolve(situation);
    }

    situations.forEach((status, index) => {
      if (
        gossip === 0 &&
        moment() > moment(limitEnterprise).subtract(status.limitMonths, 'month')
      ) {
        situation = status;
        gossip = 1;
      }
      if (gossip === 0 && situations.length === index + 1) {
        situation = status;
      }
    });

    return Promise.resolve(situation);
  }

  async findOneOrFail(id: string) {
    try {
      return await this.collaboratorRepo.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Collaborator) {
    return await this.collaboratorRepo.save(this.collaboratorRepo.create(data));
  }

  async update(id: string, data: Collaborator) {
    const collaborator = await this.findOneOrFail(id);

    this.collaboratorRepo.merge(collaborator, data);
    return await this.collaboratorRepo.save(collaborator);
  }

  async deleteById(id: string) {
    await this.collaboratorRepo.delete(id);
  }

  async createManyCollaborators(collaborators: CollaboratorBulkDto[]) {
    const collaboratorsDatabase = await this.collaboratorRepo.find();

    const collaboratorsContains = collaborators.filter((a) =>
      collaboratorsDatabase.some((b) => a.register === b.register),
    );

    const newsCollaborators = [];
    let isOldPerson = false;

    collaborators.forEach((a) => {
      isOldPerson = collaboratorsContains.some((b) => {
        return a.register === b.register;
      });

      if (!isOldPerson) newsCollaborators.push(a);
    });

    return await this.collaboratorRepo.save(newsCollaborators);
  }
}
