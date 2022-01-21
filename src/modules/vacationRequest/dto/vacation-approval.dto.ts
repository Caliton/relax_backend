import { Collaborator } from 'src/modules/collaborator/collaborator.entity';
import { ApprovalVacation } from '../approval-vacation.entity';
import { RequestStatus } from '../request-status.enum';

export class RequestStatusDto {
  readonly vacationRequestId: string;
  readonly approvalId: string;
  readonly status: RequestStatus;

  readonly cameImported: boolean;

  readonly startDate: string;

  readonly finalDate: string;

  readonly startPeriod: string;

  readonly requestUser: Collaborator;

  readonly approvalVacation: ApprovalVacation[];
}
