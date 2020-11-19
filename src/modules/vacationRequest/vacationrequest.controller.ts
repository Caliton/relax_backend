import { Controller, Post, Body, ValidationPipe, Get } from '@nestjs/common';
import { VacationRequestService } from './vacationRequest.service';
import { ApiResponse } from '@nestjs/swagger';
import { VacationRequestDto } from './dto/VacationRequest.dto';
import * as dayjs from 'dayjs'
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';


@Controller('requests')
export class VacationRequestController {
    constructor(private vacationRequestService: VacationRequestService) {
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Solicitação realizada com sucesso!.' })
    async createVacationRequest(@Body() data: VacationRequestDto) {

        return this.vacationRequestService.RequestVacation(data);
    }

    @Get()
    async getVacations() {
        return this.vacationRequestService.getAllRequests();
    }
}
