import { forwardRef, Module } from '@nestjs/common';
import { CollaboratorModule } from '../collaborator/collaborator.module';
import { PeriodStatusModule } from '../periodStatus/period-status.module';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';

@Module({
  imports: [forwardRef(() => CollaboratorModule), PeriodStatusModule],
  controllers: [PeriodController],
  providers: [PeriodService],
  exports: [PeriodService],
})
export class PeriodModule {}
