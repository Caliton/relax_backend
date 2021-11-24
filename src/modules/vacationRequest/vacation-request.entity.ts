import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';

export enum RequestStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REFUSED = 'refused',
}

@Entity()
export class VacationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  finalDate: string;

  @Column({ type: 'date' })
  startPeriod: string;

  @ManyToOne(() => Collaborator, (collaborator) => collaborator.requests)
  requestUser: Collaborator;

  @ManyToOne(() => Collaborator, (collaborator) => collaborator.approval)
  approvalUser: Collaborator;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.REQUESTED,
  })
  status: RequestStatus;
}
