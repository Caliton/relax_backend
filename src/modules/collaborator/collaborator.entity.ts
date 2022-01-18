import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Departament } from '../departament/departament.entity';
import { Profile } from '../profile/profile.entity';
import { VacationRequest } from '../vacationRequest/vacation-request.entity';

export enum CollaboratorType {
  EFFECTIVE = 'effective',
  INTERN = 'intern',
}

@Entity()
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  register: string;

  @Column({ type: 'date' })
  birthday: string;

  @Column({ type: 'date' })
  hiringdate: string;

  @ManyToOne(() => Departament, (departament) => departament.collaborators, {
    nullable: true,
  })
  departament: Departament;

  @ManyToOne(() => Profile, (profile) => profile.collaborators, {
    nullable: true,
  })
  profile: Profile;

  @ManyToOne(() => Collaborator, (collaborators) => collaborators.children, {
    nullable: true,
  })
  supervisor: Collaborator;

  @OneToMany(() => Collaborator, (collaborator) => collaborator.supervisor)
  children: Collaborator[];

  @OneToMany(() => VacationRequest, (request) => request.requestUser)
  requests: VacationRequest[];

  @ManyToMany(() => VacationRequest, (request) => request.approvalUser)
  approval: VacationRequest[];

  period: object;

  @Column({
    type: 'enum',
    enum: CollaboratorType,
    default: CollaboratorType.EFFECTIVE,
  })
  type: CollaboratorType;
}
