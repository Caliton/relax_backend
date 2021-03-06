import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PERSON_REPOSITORY } from '../../core/constants';
import { Person } from './person.entity';
import { PersonRegisterDto } from './Dto/personRegister.dto';
import { VacationTime } from '../vacationTime/vacationTime.entity';
import { VacationTimeService } from '../vacationTime/vacationtime.service';
import sequelize = require('sequelize');
import { Op } from 'sequelize';

@Injectable()
export class PersonService {
    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person,
        private readonly vacationService: VacationTimeService,
    ) { }

    async create(person: PersonRegisterDto) {
        return await this.personRepository.create<Person>(person);
    }

    async getAll(filter: string) {
        const people = await this.personRepository.findAll<Person>({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('name')),
                {
                    [Op.like]: `%${filter}%`
                }
            ),
            include: [{
                model: VacationTime,
                as: 'vacations'
            }],
            order: [
                ['name', 'ASC'],
            ]
        });

        return Promise.all(people.map(people => this.toResponseObject(people)));
    }


    private async toResponseObject(person: Person) {
        const responseObject: any = {
            id: person.id,
            name: person.name,
            hiringDate: person.hiringDate,
            registration: person.registration,
            birthDay: person.birthDay,
            vacations: person.vacations
        }

        if (person.vacations.length > 0) {
            let a = [];
            a = await this.vacationService.getVacationTimeByPerson(person.id);
            let test = a.filter(a => a.daysEnjoyed < 30)
            if (test[0]) {
                responseObject.vacationNew = test
            }
            else {
                responseObject.vacationNew = []
            }
        }

        return responseObject;
    }

    async GetById(id: number) {
        return await this.personRepository.findOne({ where: { id } });
    }

    async Update(id: any, person: PersonRegisterDto) {

        if (await this.GetById(id) == null) {
            throw new BadRequestException('Colaborador n??o encontrado');
        }

        return await this.personRepository.update<Person>(person, { where: { id } })[0];
    }

    async Delete(id: any) {
        return await this.personRepository.destroy({ where: { id } })[0];
    }


    async CreateManyPeople(persons: PersonRegisterDto[]) {
        try {
            const personsDatabase = await this.getAll('');

            const personsJaContem = persons.filter(x => personsDatabase.some(y => y.registration === x.registration));

            const newPersons: PersonRegisterDto[] = [];

            let isOldPerson = false;

            persons.forEach(a => {
                isOldPerson = personsJaContem.some((b) => { return a.registration === b.registration })
                if(!isOldPerson) {
                    newPersons.push(a)
                }
            })

            return await this.personRepository.bulkCreate<Person>(newPersons);
        } catch (ex) {
            console.error(ex)
            throw new InternalServerErrorException(ex);
        }
    }
}
