import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Departament } from '../departament/departament.entity';
import { Period } from '../period/period.entity';
import { Profile } from '../profile/profile.entity';
import { VacationRequest } from '../vacationRequest/vacation-request.entity';

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

  @OneToMany(() => VacationRequest, (request) => request.approvalUser)
  approval: VacationRequest[];

  period: object;
}
