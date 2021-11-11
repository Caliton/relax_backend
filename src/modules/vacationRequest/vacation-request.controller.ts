import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VacationRequest } from './vacation-request.entity';
import { VacationRequestService } from './vacation-request.service';

@Controller('vacationrequest')
export class VacationRequestController {
  constructor(
    private readonly vacationRequestService: VacationRequestService,
  ) {}

  @Get()
  async index(): Promise<VacationRequest[]> {
    return this.vacationRequestService.findAll();
  }

  @Post()
  async create(@Body() body: VacationRequest) {
    return await this.vacationRequestService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: VacationRequest) {
    return await this.vacationRequestService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.vacationRequestService.deleteById(id);
  }
}
