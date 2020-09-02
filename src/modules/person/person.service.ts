import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PERSON_REPOSITORY } from '../../core/constants';
import { Person } from './person.entity';
import { PersonRegisterDto } from './Dto/personRegister.dto';
import { VacationTime } from '../vacationTime/vacationTime.entity';

@Injectable()
export class PersonService {
    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person
    ) { }

    async create(person: PersonRegisterDto) {
        return await this.personRepository.create<Person>(person);
    }

    async getAll() {
        const people = await this.personRepository.findAll<Person>({
            include: [{
                model: VacationTime,
                as: 'vacations'
            }],
            order: [
                ['name', 'ASC'],
            ]
        });

        return people;
    }

    async GetById(id: number) {
        return await this.personRepository.findOne({ where: { id } });
    }

    async Update(id: any, person: PersonRegisterDto) {

        if (await this.GetById(id) == null) {
            throw new BadRequestException('Colaborador não encontrado');
        }

        return await this.personRepository.update<Person>(person, { where: { id } })[0];
    }

    async Delete(id: any) {
        return await this.personRepository.destroy({ where: { id } })[0];
    }

    async CreateManyPeople(data: PersonRegisterDto[]) {
        try {
            return await this.personRepository.bulkCreate<Person>(data);
        } catch (ex) {
            console.error(ex)
            throw new InternalServerErrorException(ex);

        }
    }
}
