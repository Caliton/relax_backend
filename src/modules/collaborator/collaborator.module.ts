import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodModule } from '../period/period.module';
import { PeriodService } from '../period/period.service';
import { PeriodStatusModule } from '../periodStatus/period-status.module';
import { VacationRequestModule } from '../vacationRequest/vacation-request.module';
import { CollaboratorController } from './collaborator.controller';
import { Collaborator } from './collaborator.entity';
import { CollaboratorService } from './collaborator.service';

@Module({
  imports: [
    forwardRef(() => PeriodModule),
    PeriodStatusModule,
    VacationRequestModule,
    TypeOrmModule.forFeature([Collaborator]),
  ],
  controllers: [CollaboratorController],
  providers: [CollaboratorService],
  exports: [CollaboratorService],
})
export class CollaboratorModule {}
