import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Collaborator } from './collaborator.entity';
import * as moment from 'moment';
import { CollaboratorBulkDto } from './dto/collaboratorBulkDto';
import { FilterCollaboratorDto } from './dto/filter-collaborator.dto';
import { handleErrors } from 'src/shared/utils/errors-helper';
import {
  RequestStatus,
  VacationRequest,
} from '../vacationRequest/vacation-request.entity';
import { VacationRequestService } from '../vacationRequest/vacation-request.service';
import { PeriodService } from '../period/period.service';

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
    private readonly requestService: VacationRequestService,
    @Inject(forwardRef(() => PeriodService))
    private readonly periodService: PeriodService,
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
        const { requests, hiringdate, type } = collaborator;
        const { limitEnterprise } = this.periodService.makePeriodLimits({
          requests,
          hiringdate,
        });

        const period = this.periodService.makePeriodRange({
          requests,
          hiringdate,
        });

        const { daysEnjoyed } = this.periodService.makePeriodDaysAllowed(
          requests,
          period,
        );

        const situation = await this.periodService.makePeriodStatus(
          limitEnterprise,
          daysEnjoyed,
          type,
        );

        return { ...collaborator, situation };
      }),
    );
  }

  public async findAllCollaborators(query: FilterCollaboratorDto) {
    try {
      let { filter } = query;
      if (!filter) filter = '';

      return await this.collaboratorRepo.find({
        relations: ['requests'],
        order: { name: 'ASC' },
        where: { name: Like(`%${filter}%`) },
      });
    } catch (e) {}
  }

  public async findRequests(id: string) {
    if (!id) throw handleErrors(id, 'id do colaborador não informado');

    const collaborator = await this.collaboratorRepo.findOne(id, {
      relations: ['requests'],
    });

    const { requests, hiringdate, type } = collaborator;

    const { start, end } = this.periodService.makePeriodRange({
      requests,
      hiringdate,
    });

    const { limitEnterprise, ultimate } = this.periodService.makePeriodLimits({
      requests,
      hiringdate,
    });

    const { daysAllowed, daysEnjoyed, daysBalance } =
      this.periodService.makePeriodDaysAllowed(requests, { start, end });

    const situation = await this.periodService.makePeriodStatus(
      limitEnterprise,
      daysEnjoyed,
      type,
    );

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

  async findOneOrFail(id: string) {
    try {
      return await this.collaboratorRepo.findOneOrFail(id, {
        relations: ['requests'],
      });
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
        const finalDate = startDate.clone().add(29, 'day');

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
