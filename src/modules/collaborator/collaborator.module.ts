import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodStatusModule } from '../periodStatus/period-status.module';
import { CollaboratorController } from './collaborator.controller';
import { Collaborator } from './collaborator.entity';
import { CollaboratorService } from './collaborator.service';

@Module({
  imports: [PeriodStatusModule, TypeOrmModule.forFeature([Collaborator])],
  controllers: [CollaboratorController],
  providers: [CollaboratorService],
  exports: [CollaboratorService],
})
export class CollaboratorModule {}