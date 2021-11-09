import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;
}
