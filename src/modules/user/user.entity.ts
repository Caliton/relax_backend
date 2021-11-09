import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';
import { Role } from '../role/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Collaborator)
  @JoinColumn()
  collaborator: Collaborator;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column()
  login: string;

  @Column()
  password: string;
}
