import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async index(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Post()
  async create(@Body() body: Role) {
    return await this.roleService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Role) {
    return await this.roleService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.roleService.deleteById(id);
  }
}
