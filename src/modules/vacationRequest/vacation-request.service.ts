import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { GlobalSettingsService } from '../globalSettings/globalsettings.service';
import { PeriodService } from '../period/period.service';
import { UserRole } from '../user/user-role.enum';
import { ApprovalVacation } from './approval-vacation.entity';
import { ApprovalVacationCreateDto } from './dto/approval-vacation-create.dto';
import { RequestStatusDto } from './dto/request-status.dto';
import { VacationRequest } from './vacation-request.entity';

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepo: Repository<VacationRequest>,
    @InjectRepository(ApprovalVacation)
    private readonly approvalVacationRepo: Repository<ApprovalVacation>,
    @Inject(forwardRef(() => PeriodService))
    private readonly periodService: PeriodService,
    private readonly globalSettingService: GlobalSettingsService,
    @Inject(forwardRef(() => CollaboratorService))
    private readonly collaboratorService: CollaboratorService,
  ) {}

  public async findAll() {
    const requests = await this.vacationRequestRepo.find({
      relations: ['requestUser', 'approvalVacation'],
    });

    return requests.map((e) => ({
      ...e,
      ...this.periodService.makePeriodDaysAllowed(requests, {
        start: e.startPeriod,
        end: moment(e.startPeriod)
          .year(moment(e.startPeriod).year() + 1)
          .format('YYYY-MM-DD'),
      }),
    }));
  }

  public async alterStatus(requestStatus: RequestStatusDto) {
    try {
      const { vacationRequestId, approvalId, status } = requestStatus;

      const canApprove = await this.permissionApproval(approvalId);

      if (!canApprove) {
        throw new UnauthorizedException(
          'Usuário não tem permissão de alterar status',
        );
      }

      const approvalNumberRequired = parseInt(
        await this.globalSettingService.getSettings('APPROVAL_NUMBER'),
      );

      const approvalVacations = await this.approvalVacationRepo.find({
        relations: ['approval'],
        where: { vacationRequest: vacationRequestId },
      });

      if (!approvalVacations.length) {
        const collaborator = new Collaborator();
        collaborator.id = canApprove;

        const vacationRequest = new VacationRequest();
        vacationRequest.id = vacationRequestId;

        const newApproval = {
          collaborator,
          vacationRequest,
          status,
        };

        return await this.factoryApprovalVacation(newApproval);
      }

      const isEditApproval = approvalVacations.find(
        (av) => av.approval.id === canApprove,
      );

      if (isEditApproval) {
        isEditApproval.status = status;
        return await this.updateApproval(isEditApproval.id, isEditApproval);
      }

      if (approvalVacations.length < approvalNumberRequired) {
        const collaborator = new Collaborator();
        collaborator.id = canApprove;

        const vacationRequest = new VacationRequest();
        vacationRequest.id = vacationRequestId;

        const newApproval = {
          collaborator,
          vacationRequest,
          status,
        };

        return await this.factoryApprovalVacation(newApproval);
      }
    } catch (e) {}
  }

  private async factoryApprovalVacation(data: ApprovalVacationCreateDto) {
    try {
      const { collaborator, vacationRequest, status } = data;
      const newApprovationVacation = new ApprovalVacation();

      newApprovationVacation.approval = collaborator;
      newApprovationVacation.vacationRequest = vacationRequest;
      newApprovationVacation.itSaw = true;
      newApprovationVacation.status = status;

      return await this.createApprovationVacation(newApprovationVacation);
    } catch (error) {}
  }

  private async permissionApproval(id: string) {
    try {
      const subject = await this.collaboratorService.investigateCollaborator(
        id,
      );

      const allowedRoles = [UserRole.HR, UserRole.MANAGER, UserRole.ADMIN];

      return allowedRoles.includes(subject.role) ? subject.id : false;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  public async findOneOrFail(id: string) {
    try {
      return await this.vacationRequestRepo.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async findOneOrFailApprovalVacation(id: string) {
    try {
      return await this.approvalVacationRepo.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async create(data: VacationRequest) {
    return await this.vacationRequestRepo.save(
      this.vacationRequestRepo.create(data),
    );
  }

  public async createApprovationVacation(data: ApprovalVacation) {
    return await this.approvalVacationRepo.save(
      this.approvalVacationRepo.create(data),
    );
  }

  public async update(id: string, data: VacationRequest) {
    const profile = await this.findOneOrFail(id);

    this.vacationRequestRepo.merge(profile, data);
    return await this.vacationRequestRepo.save(profile);
  }

  public async updateApproval(id: string, data: ApprovalVacation) {
    const approval = await this.findOneOrFailApprovalVacation(id);

    this.approvalVacationRepo.merge(approval, data);
    return await this.approvalVacationRepo.save(approval);
  }

  public async deleteById(id: string) {
    await this.vacationRequestRepo.delete(id);
  }
}
