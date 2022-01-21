import { forwardRef, Module } from '@nestjs/common';
import { CollaboratorModule } from '../collaborator/collaborator.module';
import { GlobalSettingsModule } from '../globalSettings/globalsettings.module';
import { PeriodStatusModule } from '../periodStatus/period-status.module';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';

@Module({
  imports: [
    forwardRef(() => CollaboratorModule),
    PeriodStatusModule,
    GlobalSettingsModule,
  ],
  controllers: [PeriodController],
  providers: [PeriodService],
  exports: [PeriodService],
})
export class PeriodModule {}
