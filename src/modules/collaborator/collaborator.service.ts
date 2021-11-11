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

        const { daysEnjoyed } = this.makePeriodDaysAllowed(col.requests);

        const situation = await this.makePeriodStatus(
          limitEnterprise,
          col.hiringdate,
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
      this.makePeriodDaysAllowed(collaborator.requests);

    const situation = await this.makePeriodStatus(
      limitEnterprise,
      collaborator.hiringdate,
      daysEnjoyed,
    );

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
      ), /// nao nan oanaon ta errado pega as requestes originais
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

    const newRequest = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequest.push({
        year: parseInt(item),
        daysEnjoyed: countDay(treatRequest[item]),
        requests: treatRequest[item],
      });
    });

    return newRequest.sort((a, b) => a.year - b.year);
  }

  private calculeLimitsPeriod(hiringdate: string, year: number) {
    const limitEnterprise = moment(hiringdate);
    const ultimate = moment(hiringdate);

    limitEnterprise.year(year + 1);
    limitEnterprise.month(limitEnterprise.get('month') + 6);

    ultimate.year(year + 1);
    ultimate.month(ultimate.get('month') + 11);

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
    const treatRequest = this.handleRequest(requests);
    let year = moment().year();

    // pega a data mais antiga e coloca em destaque, caso periodo esteja inadiplente
    let chaves = treatRequest
      .sort((a, b) => a.year - b.year)
      .filter((a) => a.daysEnjoyed < MAX_DAYS_PER_PERIOD)
      .shift();

    // caso todos os periodos estiver ok, ele pegara o ano mais recente
    if (!chaves)
      chaves = treatRequest
        .sort((a, b) => b.year - a.year)
        .filter((a) => a.daysEnjoyed === MAX_DAYS_PER_PERIOD)
        .shift();

    // caso não encontre nenhuma solicitação ele retornará o ano atual
    if (!chaves) return year;

    const dateMaisAntiga = chaves.requests
      .sort((a, b) => a.startDate - b.startDate)
      .shift().startDate;

    if (moment(dateMaisAntiga).month() < moment(hiringdate).month()) {
      year = chaves.year - 1;
    } else {
      year = chaves.year;
    }
    return year;
  }

  private makePeriodRange(requests: Array<VacationRequest>, hiringdate) {
    if (!requests.length)
      return this.calculeRangePeriod(hiringdate, moment(hiringdate).year() + 1);

    const year = this.calculedYear(requests, hiringdate);

    return this.calculeRangePeriod(hiringdate, year);
  }

  private makePeriodLimits(requests: Array<VacationRequest>, hiringdate) {
    if (!requests.length)
      return this.calculeLimitsPeriod(
        hiringdate,
        moment(hiringdate).year() + 1,
      );

    const year = this.calculedYear(requests, hiringdate);

    return this.calculeLimitsPeriod(hiringdate, year);
  }

  private makePeriodDaysAllowed(requests: Array<VacationRequest>) {
    const daysAllowed = MAX_DAYS_PER_PERIOD;

    let daysEnjoyed = 0;
    let daysBalance = 0;

    if (!!requests.length)
      daysEnjoyed = this.handleRequest(requests)[0].daysEnjoyed;

    daysBalance = daysAllowed - daysEnjoyed;

    return {
      daysAllowed,
      daysEnjoyed,
      daysBalance,
    };
  }

  private async makePeriodStatus(limitEnterprise, hiringdate, daysEnjoyed) {
    const situations = await this.periodStatusService.findAll();
    let situation;
    let gossip = 0;

    const lessYearCompany = moment().diff(moment(hiringdate), 'year') === 0;

    if (lessYearCompany) {
      situation = {
        description: 'NOVATO',
        color: 'grey-5',
        icon: 'fas fa-baby',
        limitMonths: 13,
        tooltip: 'Este colaborador ainda não completou um ano na empresa',
      };

      return Promise.resolve(situation);
    }

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
