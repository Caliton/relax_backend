import { RequestStatus } from '../request-status.enum';

export class RequestStatusDto {
  readonly vacationRequestId: string;
  readonly approvalId: string;
  readonly status: RequestStatus;
}
