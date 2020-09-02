import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { VACATION_TIME_REPOSITORY, PERSON_REPOSITORY } from '../../core/constants';
import { VacationTime } from './vacationTime.entity';
import { VacationTimeDto } from './dto/vacationTime.dto';
import { VacationRequest } from '../vacationRequest/vacationRequest.entity';
import { Person } from '../person/person.entity';

@Injectable()
export class VacationTimeService {
    constructor(
        @Inject(VACATION_TIME_REPOSITORY) private readonly vacationTimeRepository: typeof VacationTime,
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person
    ) { }

    public async getVacationTimeByPerson(personid: number) {
        const vacationTimes = await this.vacationTimeRepository.findAll<VacationTime>({
            include: [{
                model: VacationRequest,
                as: 'vacationsRequest'
            }],
            where: {
                personId: personid
            }
        },
        );

        return vacationTimes.map(vacation => this.toResponseObject(vacation));
    }

    public async createVacationTime(data: VacationTimeDto, personId: number) {
        const person = await this.personRepository.findOne<Person>({ where: { id: personId } });
        const customDate = new Date(person.hiringDate.toString() + 'T00:00:00');

        const insertData = {
            personId: personId,
            daysAllowed: data.daysAllowed,
            vacationDate: new Date(parseInt(data.vacationYear), customDate.getMonth(), customDate.getDate()),
            limitDate: new Date(parseInt(data.vacationYear) + 1, customDate.getMonth() - 1, customDate.getDate())
        }
        try {
            return await this.vacationTimeRepository.create<VacationTime>(insertData);
        }
        catch (ex) {
            throw new InternalServerErrorException({ Message: "Erro ao criar período de férias! ", Exception: ex});
        }
    }


    private toResponseObject(vacationTimes: VacationTime) {
        //TODO: Pensar em um maneira melhor de obter a data corretamente

        vacationTimes.vacationDate = new Date(vacationTimes.vacationDate.toString() + 'T00:00:00');
        const customDate = new Date(vacationTimes.limitDate.toString() + 'T00:00:00');

        const responseObject: any = {
            id: vacationTimes.id,
            vacationDate: vacationTimes.vacationDate,
            daysAllowed: vacationTimes.daysAllowed,
            limitDate: vacationTimes.limitDate,
            limit6Months: new Date(customDate.getFullYear(), customDate.getMonth() - 6, customDate.getDate())
        }

        if (vacationTimes.vacationsRequest) {
            responseObject.daysEnjoyed = 1 + vacationTimes.vacationsRequest
                .filter(request => request.vacationStatusId != 3)
                .reduce((previousValue, current) => previousValue + this.calcDiffInDays(current.finalDate, current.startDate), 0);
            responseObject.daysBalance = responseObject.daysAllowed - responseObject.daysEnjoyed;
        }

        return responseObject;
    }

    private calcDiffInDays(endDate: Date, startDate: Date): number {
        var diff = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays;
    }
}
