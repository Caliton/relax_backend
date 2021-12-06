import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Holiday } from './holiday.entity';
import { HolidayService } from './holiday.service';

@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async index(): Promise<Holiday[]> {
    return this.holidayService.findAll();
  }

  @Post()
  async create(@Body() body: Holiday) {
    return await this.holidayService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Holiday) {
    return await this.holidayService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.holidayService.deleteById(id);
  }
}
