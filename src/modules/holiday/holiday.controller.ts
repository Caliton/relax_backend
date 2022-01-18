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
import { Holiday } from './holiday.entity';
import { HolidayService } from './holiday.service';

@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get('all/:year')
  @ApiTags('holiday')
  async index(@Param('year') year: string): Promise<Holiday[]> {
    return this.holidayService.findAll(parseInt(year));
  }

  @Get('regional')
  @ApiTags('holiday')
  async findAllRegional(): Promise<Holiday[]> {
    return this.holidayService.findAllRegional();
  }

  @Post()
  @ApiTags('holiday')
  async create(@Body() body: Holiday) {
    return await this.holidayService.create(body);
  }

  @Put(':id')
  @ApiTags('holiday')
  async update(@Param('id') id: string, @Body() body: Holiday) {
    return await this.holidayService.update(id, body);
  }

  @Delete(':id')
  @ApiTags('holiday')
  async destroy(@Param('id') id: string) {
    await this.holidayService.deleteById(id);
  }
}
