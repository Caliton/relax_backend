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
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiTags('company')
  async index(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Post()
  @ApiTags('company')
  async create(@Body() body: Company) {
    return await this.companyService.create(body);
  }

  @Put(':id')
  @ApiTags('company')
  async update(@Param('id') id: string, @Body() body: Company) {
    return await this.companyService.update(id, body);
  }

  @Delete(':id')
  @ApiTags('company')
  async destroy(@Param('id') id: string) {
    await this.companyService.deleteById(id);
  }
}
