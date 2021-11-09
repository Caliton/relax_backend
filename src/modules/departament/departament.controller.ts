import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Departament } from './departament.entity';
import { DepartamentService } from './departament.service';

@Controller('departament')
export class DepartamentController {
  constructor(private readonly departamentService: DepartamentService) {}

  @Get()
  async index(): Promise<Departament[]> {
    return this.departamentService.findAll();
  }

  @Post()
  async create(@Body() body: Departament) {
    return await this.departamentService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Departament) {
    return await this.departamentService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.departamentService.deleteById(id);
  }
}
