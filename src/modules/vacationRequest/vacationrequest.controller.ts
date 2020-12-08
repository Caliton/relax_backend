import { Controller, Post, Body, ValidationPipe, Get, Param, Delete, Put } from '@nestjs/common';
import { VacationRequestService } from './vacationRequest.service';
import { ApiResponse } from '@nestjs/swagger';
import { VacationRequestDto } from './dto/VacationRequest.dto';
import * as dayjs from 'dayjs'
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { VacationRequest } from './vacationRequest.entity';


@Controller('requests')
export class VacationRequestController {
    constructor(private vacationRequestService: VacationRequestService) {
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Solicitação realizada com sucesso!.' })
    async createVacationRequest(@Body() data: VacationRequestDto): Promise<VacationRequest> {

        return this.vacationRequestService.RequestVacation(data);
    }

    @Get()
    async getVacations() {
        return this.vacationRequestService.getAllRequests();
    }

    @Get('person/:personid/vacationtime/:id')
    async getVacationsAccordingByUser(@Param('personid') personId, @Param('id') vacationTimeId) {
        return this.vacationRequestService.getVacationsAccordingUser(personId, vacationTimeId);
    }

    @Delete(':id')
    async deleteRequest(@Param('id') vacationRequestId) {
        return this.vacationRequestService.deleteRequest(vacationRequestId);
    }

    @Put(':id')
    async udpateRequest(@Param('id') requestToUpdateId, @Body() data: VacationRequestDto) {
        return this.vacationRequestService.updateRequest(requestToUpdateId, data);
    }
}
