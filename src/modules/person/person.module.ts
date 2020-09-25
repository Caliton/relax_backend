import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { forwardRef, Module } from '@nestjs/common';
import { personProviders } from './person.provider';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { VacationTimeService } from '../vacationTime/vacationtime.service';
import { vacationTimeProviders } from '../vacationTime/vacationTime.providers';
import { VacationTimeModule } from '../vacationTime/vacationtime.module';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        forwardRef(() => VacationTimeModule)
    ],
    controllers: [
        PersonController],
    providers: [
        PersonService, ...personProviders],
    exports: [PersonService, ...personProviders]
})
export class PersonModule { }
