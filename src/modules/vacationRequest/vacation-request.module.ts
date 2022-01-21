import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorModule } from '../collaborator/collaborator.module';
import { GlobalSettingsModule } from '../globalSettings/globalsettings.module';
import { PeriodModule } from '../period/period.module';
import { ApprovalVacation } from './approval-vacation.entity';
import { VacationRequestController } from './vacation-request.controller';
import { VacationRequest } from './vacation-request.entity';
import { VacationRequestService } from './vacation-request.service';

@Module({
  imports: [
    PeriodModule,
    GlobalSettingsModule,
    forwardRef(() => CollaboratorModule),
    TypeOrmModule.forFeature([VacationRequest]),
    TypeOrmModule.forFeature([ApprovalVacation]),
  ],
  controllers: [VacationRequestController],
  providers: [VacationRequestService],
  exports: [VacationRequestService],
})
export class VacationRequestModule {}
