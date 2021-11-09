import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodStatusService } from '../periodStatus/period-status.service';
import { Collaborator } from './collaborator.entity';
import * as moment from 'moment';
import { CollaboratorBulkDto } from './dto/collaboratorBulkDto';

@Injectable()
export class CollaboratorService {
  constructor(
    private readonly periodStatusService: PeriodStatusService,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
  ) {}

  async findAll() {
    const collaborators = await this.collaboratorRepo.find({
      relations: ['requests'],
    });

    const status = await this.periodStatusService.findAll();

    const newCollaborators = collaborators.map((col) => ({
      ...col,
      requests: this.handleRequest(col),
    }));

    return Promise.all(
      newCollaborators.map((col) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { requests, ...rest } = col;
        return { ...rest, situation: this.calculedSituation(col, status) };
      }),
    );
  }

  private handleRequest(collaborator: any) {
    const { requests } = collaborator;

    if (!requests.length) return [];

    const treatRequest = requests
      .filter((c) => c.status === 'approved')
      .reduce(
        (a: any, b: any) => ({
          ...a,
          [moment(b.finalDate).year()]: [
            ...(a[moment(b.finalDate).year()] || []),
            b,
          ],
        }),
        {},
      );

    const countDay = (lista: any) =>
      lista
        .map((item: any) => moment(item.finalDate).diff(item.startDate, 'day'))
        .reduce((a: any, b: any) => a + b);

    const newRequest = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequest.push({
        year: parseInt(item),
        daysEnjoyed: countDay(treatRequest[item]),
      });
    });

    return newRequest;
  }

  private calculeLimitsPeriod(hiringdate: string, year: number) {
    const limitEnterprise = moment(hiringdate);
    const ultimate = moment(hiringdate);

    limitEnterprise.year(year + 1);
    limitEnterprise.month(limitEnterprise.get('month') + 6);

    ultimate.year(year + 1);
    ultimate.month(ultimate.get('month') + 11);

    return { limitEnterprise, ultimate };
  }

  private calculeRangePeriod(hiringdate: string, year: number) {
    const start = moment(hiringdate);
    const end = moment(hiringdate);

    start.year(year);
    end.year(year + 1);

    return { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') };
  }

  private calculedSituation(collaborator: any, situations: Array<any>) {
    const { hiringdate, requests } = collaborator;

    let situation = {};
    let gossip = 0;
    const lessYearCompany = moment().diff(moment(hiringdate), 'year') === 0;

    if (!requests.length && !lessYearCompany) {
      situation = {
        description: 'INDEFINIDO',
        color: 'grey-5',
        icon: 'eva-alert-circle-outline',
        tooltip:
          'Este colaborador não tem histórico de lançamento de férias cadastros no sistema',
      };

      return situation;
    }

    if (lessYearCompany) {
      situation = {
        description: 'NOVATO',
        color: 'grey-5',
        icon: 'fas fa-baby',
        tooltip: 'Este colaborador ainda não completou um ano na empresa',
      };

      return situation;
    }

    const year =
      requests
        .sort((a, b) => a.year - b.year)
        .filter((a) => a.daysEnjoyed < 30)
        .shift().year || moment().year();

    const { limitEnterprise } = this.calculeLimitsPeriod(hiringdate, year);
    const rangePeriod = this.calculeRangePeriod(hiringdate, year);

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

    return { ...situation, rangePeriod: rangePeriod };
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
    await this.collaboratorRepo.softDelete(id);
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
