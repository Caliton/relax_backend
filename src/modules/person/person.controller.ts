import { Controller, Body, Post, InternalServerErrorException, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { PersonRegisterDto, BulkPersonDto } from './Dto/personRegister.dto';
import { PersonService } from './person.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('person')
export class PersonController {
    constructor(private personService: PersonService) { }

    @Post()
    @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso!.' })
    async create(@Body() person: PersonRegisterDto) {
        const response = await this.personService.create(person);
        if (response != null) {
            return { message: "Colaborador cadastrado com sucesso!" }
        }
        else {
            throw new InternalServerErrorException('Erro ao inserir usuário!');
        }
    }

    @Post('bulk')
    @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso!.' })
    async createMany(@Body() people: BulkPersonDto) {
        try {
            const response = await this.personService.CreateManyPeople(people.data);

            if (response.length === 0) {
                return { message: "Os colaboradores desta lista já encontram-se cadastrados!" }
            } else {
                return { message: `${response.length} ${response.length === 1? 'Colaborador cadastrado': 'Colaboradores cadastrados'}`}
            }

        } catch (e) {
            throw new InternalServerErrorException('Erro ao inserir usuário!');
        }
    }

    @Get()
    @ApiResponse({ status: 200 })
    async getPeople(@Query('filter') filter: string) { //TODO: Add filter and pagination
        try {
            if (!filter) {
                filter = '';
            }

            let data = await this.personService.getAll(filter);
            return data;
        } catch (ex) {
            console.log(ex);
        }
    }

    @Get(':id')
    @ApiResponse({ status: 200 })
    async getPerson(@Param() params) {
        return await this.personService.GetById(params.id);
    }

    @Put(':id')
    @ApiResponse({ status: 200 })
    async UpdatePerson(@Param() params, @Body() person: PersonRegisterDto) {
        await this.personService.Update(params.id, person)
        return { Message: `Colaborador ${params.id} atualizado` }
    }

    @Delete(':id')
    @ApiResponse({ status: 200 })
    async DeletePerson(@Param() params) {
        const result = await this.personService.Delete(params.id);
        return { Message: `Colaborador ${params.id} removido com sucesso` };
    }
}
