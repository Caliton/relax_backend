import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PeriodStatus } from './period-status.entity';
import { PeriodStatusService } from './period-status.service';

@Controller('periodstatus')
export class PeriodStatusController {
  constructor(private readonly periodstatusService: PeriodStatusService) {}

  @Get(':type')
  @ApiTags('period_status')
  async index(@Param('type') type: string): Promise<PeriodStatus[]> {
    return this.periodstatusService.findAll({ type });
  }

  @Post()
  @ApiTags('period_status')
  async create(@Body() body: PeriodStatus) {
    return await this.periodstatusService.create(body);
  }

  @Put(':id')
  @ApiTags('period_status')
  async update(@Param('id') id: string, @Body() body: PeriodStatus) {
    return await this.periodstatusService.update(id, body);
  }

  @Delete(':id')
  @ApiTags('period_status')
  async destroy(@Param('id') id: string) {
    await this.periodstatusService.deleteById(id);
  }
}
