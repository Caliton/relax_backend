import { Module } from '@nestjs/common';
import { VacationTimeService } from './vacationtime.service';
import { vacationTimeProviders } from './vacationTime.providers';
import { VacationTimeController } from './vacationtime.controller';

@Module({
    providers: [VacationTimeService, ...vacationTimeProviders],
    imports: [],
    controllers: [VacationTimeController],
})
export class VacationTimeModule {}
