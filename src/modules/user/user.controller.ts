import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() body: User) {
    return await this.userService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: User) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.userService.deleteById(id);
  }
}
