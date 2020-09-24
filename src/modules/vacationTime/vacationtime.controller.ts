import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { VacationTimeService } from './vacationtime.service';
import { VacationTimeDto } from './dto/vacationTime.dto';

@Controller()
export class VacationTimeController {

  constructor(private vacationTimeService: VacationTimeService) { }

  @Get('person/:personid/vacationtime')
  async vacationTimeByPerson(@Param('personid') personId) {
    return await this.vacationTimeService.getVacationTimeByPerson(personId);
  }

  @Post('person/:personid/vacationtime')
  async createVacationTime(@Body() data: VacationTimeDto, @Param('personid') personId) {
    return await this.vacationTimeService.createVacationTime(data, personId);
  }
}
