import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Collaborator } from './collaborator.entity';
import { CollaboratorService } from './collaborator.service';

@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @Get()
  async index(): Promise<any> {
    return await this.collaboratorService.findAll();
  }

  @Post()
  async create(@Body() body: Collaborator) {
    return await this.collaboratorService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Collaborator) {
    return await this.collaboratorService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.collaboratorService.deleteById(id);
  }
}
