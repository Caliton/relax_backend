import { Injectable, Inject } from '@nestjs/common';
import { PERSON_REPOSITORY } from '../../core/constants';
import { Person } from './person.entity';
import { UsersService } from '../users/users.service';
import { PersonRegisterDto } from './Dto/personRegister.dto';
import { UserPersonDto } from '../users/dto/user.person.dto';

@Injectable()
export class PersonService {
    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person,
        private readonly userService: UsersService
    ) { }

    async create(person: PersonRegisterDto){
        const user = await this.userService.findOneById(person.userId);

        const newPerson = await this.personRepository.create<Person>(person);
        user.person = newPerson['dataValues'];
        user.personId = user.person.id;

        if (await this.userService.UpdateUser(user.id, user)){
            return new UserPersonDto(newPerson.id, newPerson.firstName);
        }
        else {
            return null;
        }
    }
}
