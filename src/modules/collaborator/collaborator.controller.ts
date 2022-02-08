import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Collaborator } from './collaborator.entity';
import { CollaboratorService } from './collaborator.service';
import { BulkCollaboratorsDto } from './dto/collaboratorBulkDto';
import { FilterCollaboratorDto } from './dto/filter-collaborator.dto';

@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @ApiTags('collaborator')
  @Get()
  async index(@Query() query: FilterCollaboratorDto): Promise<any> {
    return await this.collaboratorService.findAll(query);
  }

  @ApiTags('collaborator')
  @Get('modelimport')
  getFile(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'collaborators_model.xlsx'),
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Modelo de Colaboradores.xlsx"',
    });
    return new StreamableFile(file);
  }

  @ApiTags('collaborator')
  @Get('all')
  async getHello(@Query() query: FilterCollaboratorDto): Promise<any> {
    return await this.collaboratorService.findAllCollaborators(query);
  }

  // @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiTags('collaborator')
  @Post('import')
  async createMany(@Body() collaborators: BulkCollaboratorsDto) {
    console.log(collaborators);

    const response = await this.collaboratorService.createManyCollaborators(
      collaborators.data,
    );

    if (!response.length)
      return {
        message: 'Os colaboradores desta lista já encontram-se cadastrados!',
      };

    return {
      message: `${response.length} ${
        response.length === 1
          ? 'Colaborador cadastrado'
          : 'Colaboradores cadastrados'
      }`,
    };
  }

  @ApiTags('collaborator')
  @Post()
  async create(@Body() body: Collaborator) {
    return await this.collaboratorService.create(body);
  }

  @ApiTags('collaborator')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Collaborator) {
    return await this.collaboratorService.update(id, body);
  }

  @ApiTags('collaborator')
  @Get(':id/vacationrequests')
  async getRequests(@Param('id') id: string) {
    return await this.collaboratorService.findRequests(id);
  }

  @ApiTags('collaborator')
  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.collaboratorService.deleteById(id);
  }
}
