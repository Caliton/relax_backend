import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Module } from '@nestjs/common';
import { personProviders } from './person.provider';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        UsersModule,
        PassportModule,
    ],
    controllers: [
        PersonController],
    providers: [
        PersonService, ...personProviders],
    exports: [PersonService, ...personProviders]
})
export class PersonModule {}
