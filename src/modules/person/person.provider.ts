
import { Person } from './person.entity';
import { PERSON_REPOSITORY } from '../../core/constants';

export const personProviders = [{
    provide: PERSON_REPOSITORY,
    useValue: Person,
}];