import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';
import { RequestStatus } from './request-status.enum';
import { VacationRequest } from './vacation-request.entity';

@Entity()
export class ApprovalVacation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  itSaw: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @ManyToOne(
    () => Collaborator,
    (collaborator) => collaborator.approvalVacation,
  )
  approval: Collaborator;

  @ManyToOne(() => VacationRequest, (vacation) => vacation.approvalVacation)
  vacationRequest: VacationRequest;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.REQUESTED,
  })
  status: RequestStatus;
}
