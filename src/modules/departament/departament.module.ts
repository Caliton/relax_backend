import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentController } from './departament.controller';
import { Departament } from './departament.entity';
import { DepartamentService } from './departament.service';

@Module({
  imports: [TypeOrmModule.forFeature([Departament])],
  controllers: [DepartamentController],
  providers: [DepartamentService],
  exports: [DepartamentService],
})
export class DepartamentModule {}
