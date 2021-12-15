import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GlobalSettings } from './globalsettings.entity';
import { GlobalSettingsService } from './globalsettings.service';

@Controller('globalsettings')
export class GlobalSettingsController {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  @Get()
  async index(): Promise<GlobalSettings[]> {
    return this.globalSettingsService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: GlobalSettings) {
    return await this.globalSettingsService.update(id, body);
  }
}
