import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum HolidayType {
  NACIONAL = 'national',
  REGIONAL = 'regional',
}

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'enum',
    enum: HolidayType,
    default: HolidayType.NACIONAL,
  })
  type: HolidayType;
}
