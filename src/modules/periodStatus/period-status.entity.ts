import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Period } from '../period/period.entity';

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
}
