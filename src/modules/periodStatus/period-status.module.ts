import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodStatusController } from './period-status.controller';
import { PeriodStatus } from './period-status.entity';
import { PeriodStatusService } from './period-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodStatus])],
  controllers: [PeriodStatusController],
  providers: [PeriodStatusService],
  exports: [PeriodStatusService],
})
export class PeriodStatusModule {}
