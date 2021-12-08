import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GlobalSettings } from './globalsettings.entity';
import { GlobalSettingsService } from './globalsettings.service';

@Controller('globalsettings')
export class GlobalSettingsController {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  @Get()
  async index(): Promise<GlobalSettings[]> {
    return this.globalSettingsService.findAll();
  }

  @Post()
  async create(@Body() body: GlobalSettings) {
    return await this.globalSettingsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: GlobalSettings) {
    return await this.globalSettingsService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.globalSettingsService.deleteById(id);
  }
}
