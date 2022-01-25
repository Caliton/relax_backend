import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Departament } from './departament.entity';
import { DepartamentService } from './departament.service';

@Controller('departament')
export class DepartamentController {
  constructor(private readonly departamentService: DepartamentService) {}

  @ApiBearerAuth()
  @ApiTags('departament')
  @Get()
  async index(): Promise<Departament[]> {
    return this.departamentService.findAll();
  }

  @ApiTags('departament')
  @Post()
  async create(@Body() body: Departament) {
    return await this.departamentService.create(body);
  }

  @ApiTags('departament')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Departament) {
    return await this.departamentService.update(id, body);
  }

  @ApiTags('departament')
  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.departamentService.deleteById(id);
  }
}
