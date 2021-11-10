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
import { BulkCollaboratorsDto } from './dto/collaboratorBulkDto';

@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @Get()
  async index(): Promise<any> {
    return await this.collaboratorService.findAll();
  }

  @Post('bulk')
  async createMany(@Body() collaborators: BulkCollaboratorsDto) {
    const response = await this.collaboratorService.createManyCollaborators(
      collaborators.data,
    );

    if (!response.length) {
      return {
        message: 'Os colaboradores desta lista já encontram-se cadastrados!',
      };
    } else {
      return {
        message: `${response.length} ${
          response.length === 1
            ? 'Colaborador cadastrado'
            : 'Colaboradores cadastrados'
        }`,
      };
    }
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