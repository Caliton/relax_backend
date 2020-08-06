import { Controller, Body, UseGuards, Post, InternalServerErrorException } from '@nestjs/common';
import { PersonRegisterDto } from './Dto/personRegister.dto';
import { PersonService } from './person.service';

@Controller()
export class PersonController {
    constructor(private personService: PersonService){}
    @Post()
    async create(@Body() person: PersonRegisterDto){
        const response = await this.personService.create(person);
        if (response == null){
            return response;   
        }
        else {
            throw new InternalServerErrorException('Erro ao inserir usuário!');
        }
    }
}
