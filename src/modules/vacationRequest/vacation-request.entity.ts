import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';
import { ApprovalVacation } from './approval-vacation.entity';

@Entity()
export class VacationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  cameImported: boolean;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  finalDate: string;

  @Column({ type: 'date' })
  startPeriod: string;

  @ManyToOne(() => Collaborator, (collaborator) => collaborator.requests)
  requestUser: Collaborator;

  @OneToMany(
    () => ApprovalVacation,
    (approvalVacat) => approvalVacat.vacationRequest,
  )
  approvalVacation: ApprovalVacation[];
}
