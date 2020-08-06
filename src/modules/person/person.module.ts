import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Module } from '@nestjs/common';
import { personProviders } from './person.provider';

@Module({
    imports: [],
    controllers: [
        PersonController],
    providers: [
        PersonService, ...personProviders],
    exports: [PersonService]
})
export class PersonModule {}
