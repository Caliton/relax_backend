import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';
import { VacationRequest } from '../vacationRequest/vacation-request.entity';
import { PeriodStatus } from '../periodStatus/period-status.entity';

import {
  ALLOWED_DAYS_PER_MONTHS,
  MAX_DAYS_PER_PERIOD,
  MONTHS_IN_A_YEAR,
} from 'src/core/enumerators';

import dayjs from 'dayjs';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  vacationDate: string;

  @Column({ type: 'int' })
  days_allowed: number;

  @Column({ type: 'date' })
  limitDate: string;

  public getDaysAllowed(): number {
    const currentDate = dayjs();
    const completedPeriod = dayjs(this.vacationDate).add(1, 'year');

    if (completedPeriod > currentDate) {
      const completedMonths =
        MONTHS_IN_A_YEAR - completedPeriod.diff(currentDate, 'month');
      return Math.floor(ALLOWED_DAYS_PER_MONTHS * completedMonths);
    } else {
      return MAX_DAYS_PER_PERIOD;
    }
  }
}
