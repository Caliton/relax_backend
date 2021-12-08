import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborator } from 'src/modules/collaborator/collaborator.entity';
import { Departament } from 'src/modules/departament/departament.entity';
import { GlobalSettings } from 'src/modules/globalSettings/globalsettings.entity';
import { PeriodStatus } from 'src/modules/periodStatus/period-status.entity';
import { Profile } from 'src/modules/profile/profile.entity';
import { VacationRequest } from 'src/modules/vacationRequest/vacation-request.entity';
import { User } from 'src/modules/user/user.entity';
import { Holiday } from 'src/modules/holiday/holiday.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      entities: [
        Collaborator,
        Departament,
        GlobalSettings,
        Holiday,
        PeriodStatus,
        Profile,
        User,
        VacationRequest,
      ],
      synchronize: process.env.DEPLOY !== 'prod',
    }),
  ],
})
export class DbModule {}
