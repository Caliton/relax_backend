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
import { CollaboratorService } from '../collaborator/collaborator.service';
import { GlobalSettingsService } from '../globalSettings/globalsettings.service';
import { PeriodService } from '../period/period.service';
import { UserRole } from '../user/user-role.enum';
import { ApprovalVacation } from './approval-vacation.entity';
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
      const { vacationRequestId, approvalId } = requestStatus;

      const canApproval = await this.permissionApproval(approvalId);

      if (!canApproval) {
        throw new UnauthorizedException(
          'Usuário não tem permissão de alterar status',
        );
      }

      const approvalNumberRequired =
        await this.globalSettingService.getSettings('APPROVAL_NUMBER');

      const approvalVacations = await this.approvalVacationRepo.find({
        where: { vacationRequest: vacationRequestId },
      });

      if (
        approvalVacations.length > 0 &&
        approvalVacations.length <= parseInt(approvalNumberRequired)
      ) {
        let approvalVacation = approvalVacations.find(
          (av) => av.approval.id === approvalId,
        );

        if (approvalVacation) approvalVacation.status = requestStatus.status;
        else {
          approvalVacation = new ApprovalVacation();

          approvalVacation.approval.id = approvalId;
          approvalVacation.vacationRequest.id = vacationRequestId;
          approvalVacation.itSaw = true;
          approvalVacation.status = requestStatus.status;
        }

        return await this.approvalVacationRepo.save(approvalVacation);
      } else if (!approvalVacations.length) {
        const newApprovationVacation = new ApprovalVacation();

        newApprovationVacation.approval.id = approvalId;
        newApprovationVacation.vacationRequest.id = vacationRequestId;
        newApprovationVacation.itSaw = true;
        newApprovationVacation.status = requestStatus.status;

        return await this.approvalVacationRepo.save(newApprovationVacation);
      }
    } catch (e) {}
  }

  private async permissionApproval(id: string) {
    try {
      const subject = await this.collaboratorService.investigateCollaborator(
        id,
      );

      const allowedRoles = [UserRole.HR, UserRole.MANAGER, UserRole.ADMIN];

      return allowedRoles.includes(subject.role);
    } catch (e) {}
  }

  public async findOneOrFail(id: string) {
    try {
      return await this.vacationRequestRepo.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async create(data: VacationRequest) {
    return await this.vacationRequestRepo.save(
      this.vacationRequestRepo.create(data),
    );
  }

  // public async getVacationRequests() {
  //   try {
  //     const teste = await this.vacationRequestRepo.find({ select: {}})
  //     return {};
  //   } catch (error) {}
  // }

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

  public async deleteById(id: string) {
    await this.vacationRequestRepo.delete(id);
  }
}
