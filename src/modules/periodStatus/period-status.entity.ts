import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CollaboratorType } from '../collaborator/collaborator.entity';

@Entity()
export class PeriodStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('int')
  limitMonths: number;

  @Column()
  color: string;

  @Column()
  icon: string;

  @Column()
  tooltip: string;

  @Column({
    type: 'enum',
    enum: CollaboratorType,
    default: CollaboratorType.EFFECTIVE,
  })
  type: CollaboratorType;
}
