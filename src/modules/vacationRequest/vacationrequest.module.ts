import { Module } from '@nestjs/common';
import { VacationRequestController } from './vacationrequest.controller';
import { VacationRequestService } from './vacationRequest.service';
import { vacationRequestProviders } from './vacationRequest.providers';

@Module({
    controllers: [VacationRequestController],
    imports: [],
    providers: [VacationRequestService, ...vacationRequestProviders],
})
export class VacationRequestModule {}
