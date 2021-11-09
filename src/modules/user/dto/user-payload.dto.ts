import { Collaborator } from 'src/modules/collaborator/collaborator.entity';
import { Role } from 'src/modules/role/role.entity';

export class UserPayloadDto {
  readonly id: string;
  readonly login: string;
  readonly role: Role;
  readonly collaborator: Collaborator;
}
