import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collaborator } from '../collaborator/collaborator.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  // @OneToMany(() => Collaborator, (collaborator) => collaborator.company)
  // collaborators: Collaborator[];
}
