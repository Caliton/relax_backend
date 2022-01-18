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
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiTags('profile')
  async index(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Post()
  @ApiTags('profile')
  async create(@Body() body: Profile) {
    return await this.profileService.create(body);
  }

  @Put(':id')
  @ApiTags('profile')
  async update(@Param('id') id: string, @Body() body: Profile) {
    return await this.profileService.update(id, body);
  }

  @Delete(':id')
  @ApiTags('profile')
  async destroy(@Param('id') id: string) {
    await this.profileService.deleteById(id);
  }
}
