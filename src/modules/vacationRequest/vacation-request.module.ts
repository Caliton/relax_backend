import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequestController } from './vacation-request.controller';
import { VacationRequest } from './vacation-request.entity';
import { VacationRequestService } from './vacation-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [VacationRequestController],
  providers: [VacationRequestService],
  exports: [VacationRequestService],
})
export class VacationRequestModule {}
