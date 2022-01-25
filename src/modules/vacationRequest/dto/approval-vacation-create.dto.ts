import { Collaborator } from 'src/modules/collaborator/collaborator.entity';
import { RequestStatus } from '../request-status.enum';
import { VacationRequest } from '../vacation-request.entity';

export class ApprovalVacationCreateDto {
  readonly status: RequestStatus;
  readonly collaborator: Collaborator;
  readonly vacationRequest: VacationRequest;
}
