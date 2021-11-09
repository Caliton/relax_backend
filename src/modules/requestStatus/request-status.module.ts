import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestStatusController } from './request-status.controller';
import { RequestStatus } from './request-status.entity';
import { RequestStatusService } from './request-status.service';

@Module({
  controllers: [RequestStatusController],
  providers: [RequestStatusService],
})
export class RequestStatusModule {}
