import { Injectable, Inject } from '@nestjs/common';
import { PERSON_REPOSITORY } from '../../core/constants';
import { Person } from './person.entity';

@Injectable()
export class PersonService {
    constructor(@Inject(PERSON_REPOSITORY) private readonly userRepository: typeof Person) { }
}
