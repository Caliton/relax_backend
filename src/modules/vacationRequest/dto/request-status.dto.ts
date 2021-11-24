import { RequestStatus } from '../vacation-request.entity';

export class RequestStatusDto {
  readonly id: string;
  readonly status: RequestStatus;
}
