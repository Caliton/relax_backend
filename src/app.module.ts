import { VacationRequestController } from './modules/vacationRequest/vacationrequest.controller';
import { VacationRequestModule } from './modules/vacationRequest/vacationrequest.module';
import { VacationTimeController } from './modules/vacationTime/vacationtime.controller';
import { VacationTimeModule } from './modules/vacationTime/vacationtime.module';
import { VacationTimeService } from './modules/vacationTime/vacationtime.service';
import { PersonModule } from './modules/person/person.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    VacationRequestModule, 
    VacationTimeModule, 
    PersonModule, 
    AuthModule, 
    ConfigModule.forRoot({ isGlobal:true}),
    DatabaseModule,
    UsersModule
  ],
  controllers: [ 
        AppController],
  providers: [
        AppService],
})
export class AppModule {}
