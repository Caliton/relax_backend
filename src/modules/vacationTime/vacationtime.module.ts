import { Module } from '@nestjs/common';
import { VacationTimeService } from './vacationtime.service';
import { vacationTimeProviders } from './vacationTime.providers';
import { VacationTimeController } from './vacationtime.controller';
import { PersonModule } from '../person/person.module';

@Module({
    providers: [VacationTimeService, ...vacationTimeProviders],
    imports: [PersonModule],
    controllers: [VacationTimeController],
})
export class VacationTimeModule {}
