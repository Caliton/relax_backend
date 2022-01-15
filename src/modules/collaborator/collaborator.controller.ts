import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Collaborator } from './collaborator.entity';
import { CollaboratorService } from './collaborator.service';
import { BulkCollaboratorsDto } from './dto/collaboratorBulkDto';
import { FilterCollaboratorDto } from './dto/filter-collaborator.dto';

@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @Get()
  async index(@Query() query: FilterCollaboratorDto): Promise<any> {
    return await this.collaboratorService.findAll(query);
  }

  @Get('all')
  async getHello(@Query() query: FilterCollaboratorDto): Promise<any> {
    return await this.collaboratorService.findAllCollaborators(query);
  }

  // @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
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

  @Post()
  async create(@Body() body: Collaborator) {
    return await this.collaboratorService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Collaborator) {
    return await this.collaboratorService.update(id, body);
  }

  @Get(':id/vacationrequests')
  async getRequests(@Param('id') id: string) {
    return await this.collaboratorService.findRequests(id);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.collaboratorService.deleteById(id);
  }
}
