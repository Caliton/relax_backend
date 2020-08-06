import { Controller, Body, UseGuards, Post, InternalServerErrorException, Get, Put, Param, BadRequestException, Delete } from '@nestjs/common';
import { PersonRegisterDto } from './Dto/personRegister.dto';
import { PersonService } from './person.service';
import { CreatedAt } from 'sequelize-typescript';
import { ApiResponse } from '@nestjs/swagger';

@Controller('person')
export class PersonController {
    constructor(private personService: PersonService){}

    @Post()
    @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso!.'})   
    async create(@Body() person: PersonRegisterDto){
        const response = await this.personService.create(person);
        if (response != null){
            return { message: "Colaborador cadastrado com sucesso!"}
        }
        else {
            throw new InternalServerErrorException('Erro ao inserir usuário!');
        }
    }

    @Get()
    @ApiResponse({status: 200})
    async getPeople(){ //TODO: Add filter and paginations
        return await this.personService.getAll();
    }

    @Get(':id')
    @ApiResponse({status: 200})
    async getPerson(@Param() params){
        return await this.personService.GetById(params.id);
    }

    @Put(':id')
    @ApiResponse({status: 200})
    async UpdatePerson(@Param() params, @Body() person: PersonRegisterDto){
        await this.personService.Update(params.id, person)
        return {Message : `Colaborador ${params.id} atualizado` }
    }

}
