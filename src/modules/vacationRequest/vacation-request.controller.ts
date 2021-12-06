import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequestStatusDto } from './dto/request-status.dto';
import { VacationRequest } from './vacation-request.entity';
import { VacationRequestService } from './vacation-request.service';

@Controller('vacationrequest')
export class VacationRequestController {
  constructor(
    private readonly vacationRequestService: VacationRequestService,
  ) {}

  @Post('status')
  async setStatusRequest(@Body() requestStatus: RequestStatusDto) {
    return this.vacationRequestService.alterStatus(requestStatus);
  }

  @Get()
  async index(): Promise<VacationRequest[]> {
    return this.vacationRequestService.findAll();
  }

  @Post()
  async create(@Body() body: VacationRequest) {
    return await this.vacationRequestService.create(body);
  }

  // @Post('oi')
  // async oi(@Body() body) {
  //   this.vacationRequestService.cachorro(body);

  //   return 'oi';
  // }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: VacationRequest) {
    return await this.vacationRequestService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    await this.vacationRequestService.deleteById(id);
  }
}
