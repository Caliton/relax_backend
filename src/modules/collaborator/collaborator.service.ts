import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PeriodStatusService } from '../periodStatus/period-status.service';
import { Collaborator } from './collaborator.entity';
import * as moment from 'moment';
import { CollaboratorBulkDto } from './dto/collaboratorBulkDto';
import { FilterCollaboratorDto } from './dto/filter-collaborator.dto';
import { handleErrors } from 'src/shared/utils/errors-helper';
import {
  RequestStatus,
  VacationRequest,
} from '../vacationRequest/vacation-request.entity';
import { MAX_DAYS_PER_PERIOD } from 'src/core/enumerators';
import { VacationRequestService } from '../vacationRequest/vacation-request.service';

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
    private readonly requestService: VacationRequestService,

    private readonly periodStatusService: PeriodStatusService,
  ) {}

  public async findAll(query: FilterCollaboratorDto) {
    let { filter } = query;
    if (!filter) filter = '';

    const collaborators = await this.collaboratorRepo.find({
      relations: ['requests'],
      order: { name: 'ASC' },
      where: { name: Like(`%${filter}%`) },
    });

    return Promise.all(
      collaborators.map(async (collaborator) => {
        const { requests, hiringdate } = collaborator;
        const { limitEnterprise } = this.makePeriodLimits({
          requests,
          hiringdate,
        });

        const period = this.makePeriodRange({ requests, hiringdate });

        const { daysEnjoyed } = this.makePeriodDaysAllowed(requests, period);

        const situation = await this.makePeriodStatus(
          limitEnterprise,
          daysEnjoyed,
        );

        return { ...collaborator, situation };
      }),
    );
  }

  public async findRequests(id: string) {
    if (!id) throw handleErrors(id, 'id do colaborador não informado');

    const collaborator = await this.collaboratorRepo.findOne(id, {
      relations: ['requests'],
    });

    const { requests, hiringdate } = collaborator;

    const { start, end } = this.makePeriodRange({ requests, hiringdate });

    const { limitEnterprise, ultimate } = this.makePeriodLimits({
      requests,
      hiringdate,
    });

    const { daysAllowed, daysEnjoyed, daysBalance } =
      this.makePeriodDaysAllowed(requests, { start, end });

    const situation = await this.makePeriodStatus(limitEnterprise, daysEnjoyed);

    const period = {
      start,
      end,
      limitEnterprise,
      ultimate,
      daysAllowed,
      daysEnjoyed,
      daysBalance,
      requests: requests.filter((a) => a.startPeriod === start),
      situation,
    };

    return { ...period };
  }

  public async getPeriod(id: string, year: number) {
    if (!id) throw handleErrors(id, 'id do colaborador não informado');

    const collaborator = await this.collaboratorRepo.findOne(id, {
      relations: ['requests'],
    });

    const { requests, hiringdate } = collaborator;

    const { start, end } = this.makePeriodRange({ requests, hiringdate, year });

    const { limitEnterprise, ultimate } = this.makePeriodLimits({
      requests,
      hiringdate,
      year,
    });

    const { daysAllowed, daysEnjoyed, daysBalance, daysScheduled } =
      this.makePeriodDaysAllowed(requests, { start, end });

    const situation = await this.makePeriodStatus(limitEnterprise, daysEnjoyed);

    const period = {
      start,
      end,
      limitEnterprise,
      ultimate,
      daysAllowed,
      daysEnjoyed,
      daysScheduled,
      daysBalance,
      requests: requests
        .filter((a) => a.startPeriod === start)
        .sort(
          (a, b) =>
            parseInt(moment(b.startDate).format('YYYYMMDD')) -
            parseInt(moment(a.startDate).format('YYYYMMDD')),
        ),
      situation,
    };

    return { ...period };
  }

  private reduceYearRequest(requests: Array<VacationRequest>, status) {
    const reduceRequests = requests
      .filter((c) => status.includes(c.status))
      .reduce(
        (a: any, b: any) => ({
          ...a,
          [moment(b.startPeriod).year()]: [
            ...(a[moment(b.startPeriod).year()] || []),
            b,
          ],
        }),
        {},
      );

    return reduceRequests;
  }

  private handleRequest(requests: Array<VacationRequest>) {
    const treatRequestApproved = this.reduceYearRequest(requests, ['approved']);
    const treatRequest = this.reduceYearRequest(requests, [
      'approved',
      'refused',
      'requested',
    ]);

    const newRequests = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequests.push({
        year: parseInt(item),
        daysEnjoyed: this.countDay(treatRequestApproved[item]),
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

  private countDay(list: any) {
    if (!list || !list.length) return 0;
    return list
      .map((item: any) => moment(item.finalDate).diff(item.startDate, 'day'))
      .reduce((a: any, b: any) => a + b);
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

    // const oldestDate = pendingDate.requests.sort(
    //   (a, b) =>
    //     parseInt(moment(a.startDate).format('YYYYDDMM')) -
    //     parseInt(moment(b.startDate).format('YYYYDDMM')),
    // )[0].startDate;

    // // check if the year of the period is the one found or refers to the year of the previous period
    // if (moment(oldestDate).month() < moment(hiringdate).month()) {
    //   year = pendingDate.year - 1;
    // } else {
    //   year = pendingDate.year;
    // }
    year = pendingDate.year;

    return year;
  }

  private makePeriodRange(props) {
    const { requests, hiringdate } = props;

    const year = props.year || this.calculedYear(requests, hiringdate);

    return this.calculeRangePeriod(hiringdate, year);
  }

  private makePeriodLimits(props) {
    const { requests, hiringdate } = props;

    const year = props.year || this.calculedYear(requests, hiringdate);

    return this.calculeLimitsPeriod(hiringdate, year);
  }

  private makePeriodDaysAllowed(
    requests: Array<VacationRequest>,
    period: { start: string; end: string },
  ) {
    const daysAllowed = MAX_DAYS_PER_PERIOD;

    let daysBalance = 0;
    let daysScheduled = 0;
    let daysEnjoyed = 0;

    let letReserve = 0;

    if (requests.length) {
      // const requestAgroupYear = this.handleRequest(requests);

      const requestScheduled = requests.filter(
        (request) =>
          request.startPeriod === period.start &&
          request.status === RequestStatus.APPROVED,
      );

      const requestEnjoyed = requests.filter(
        (request) =>
          request.startPeriod === period.start &&
          request.status === RequestStatus.APPROVED &&
          parseInt(moment(request.finalDate).format('YYYYMMDD')) <
            parseInt(moment().format('YYYYMMDD')),
      );

      if (!requestEnjoyed.length) {
        daysEnjoyed = 0;
      } else {
        daysEnjoyed = requestEnjoyed
          .map((item) => moment(item.finalDate).diff(item.startDate, 'day'))
          .reduce((a, b) => a + b);
      }

      letReserve = this.countDay(requestScheduled);
    }

    daysScheduled = letReserve - daysEnjoyed;
    daysBalance = daysAllowed - letReserve;

    return {
      daysAllowed,
      daysEnjoyed,
      daysScheduled,
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

    // const listRequest = await this.requestService.findAll();

    const newColabInserted = await this.collaboratorRepo.save(
      newsCollaborators,
    );

    if (newColabInserted.length) {
      newColabInserted.forEach(async (a) => {
        const colab = new Collaborator();
        colab.id = a.id;

        const vacationOk: VacationRequest = new VacationRequest();

        const startDate = moment(a.hiringdate).year(a.periodOk);
        const finalDate = startDate.clone().add(30, 'day');

        vacationOk.startDate = startDate.format('YYYY-MM-DD');
        vacationOk.finalDate = finalDate.format('YYYY-MM-DD');
        vacationOk.startPeriod = startDate.format('YYYY-MM-DD');
        vacationOk.requestUser = colab;
        vacationOk.status = RequestStatus.APPROVED;
        vacationOk.approvalUser = null;

        if (a.daysEnjoyed > 0) {
          const vacationNo: VacationRequest = new VacationRequest();
          const startDateNo = moment(a.hiringdate).year(a.periodOk + 1);
          const finalDateNo = startDateNo.clone().add(a.daysEnjoyed, 'day');

          vacationNo.startDate = startDateNo.format('YYYY-MM-DD');
          vacationNo.finalDate = finalDateNo.format('YYYY-MM-DD');
          vacationNo.startPeriod = startDateNo.format('YYYY-MM-DD');
          vacationNo.requestUser = colab;
          vacationNo.status = RequestStatus.APPROVED;
          vacationNo.approvalUser = null;
          await this.requestService.create(vacationNo);
        }

        await this.requestService.create(vacationOk);
      });
    }

    return newColabInserted;
  }
}
