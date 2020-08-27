import { Injectable, Inject } from '@nestjs/common';
import { VACATION_TIME_REPOSITORY } from '../../core/constants';
import { VacationTime } from './vacationTime.entity';
import { VacationTImeDto } from './dto/vacationTime.dto';

@Injectable()
export class VacationTimeService {
    constructor(
        @Inject(VACATION_TIME_REPOSITORY) private readonly vacationTimeRepository: typeof VacationTime
        ) { }
        
        async getVacationTimeByPerson(personid: any) {
            return await this.vacationTimeRepository.findAll<VacationTime>({
                where: { 
                    personId: personid
                }});
        }

        async createVacationTime(data: VacationTImeDto) {
            return await this.vacationTimeRepository.create<VacationTime>(data);
        }
}
