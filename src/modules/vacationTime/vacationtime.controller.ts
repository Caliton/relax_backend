import { Controller, Param, Get, Post, Body, Delete } from '@nestjs/common';
import { VacationTimeService } from './vacationtime.service';
import { VacationTimeDto } from './dto/vacationTime.dto';
import { ApiResponse } from '@nestjs/swagger';

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

  @Delete('vacationtime/:id')
  @ApiResponse({ status: 200 })
  async deleteVacationTime(@Param() params) {
      await this.vacationTimeService.deleteVacationTime(params.id);
 
      return { Message: `Periodo ${params.id} removido com sucesso` };
  }
}
