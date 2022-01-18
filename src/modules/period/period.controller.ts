import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PeriodService } from './period.service';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodstatusService: PeriodService) {}

  @Get(':id/collaborator')
  @ApiTags('period')
  async getNextPeriod(@Param('id') id: string, @Query() year) {
    console.log(year);

    return await this.periodstatusService.getPeriod(id, parseInt(year.year));
  }
}
