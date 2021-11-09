import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async index(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Post()
  async create(@Body() body: Profile) {
    return await this.profileService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Profile) {
    return await this.profileService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.profileService.deleteById(id);
  }
}
