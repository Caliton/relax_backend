import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Person } from '../../modules/person/person.entity';
import { VacationTime } from '../../modules/vacationTime/vacationTime.entity';
import { VacationRequest } from '../../modules/vacationRequest/vacationRequest.entity';
import { VacationStatus } from '../../modules/vacationRequest/entitties/vacationStatus.entity';

export const databaseProviders = [{
   provide: SEQUELIZE,
   useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
         case 'DEVELOPMENT':
            config = databaseConfig.development;
            break;
         case 'TEST':
            config = databaseConfig.test;
            break;
         case 'PRODUCTION':
            config = databaseConfig.production;
            break;
         default:
            config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Person, VacationTime, VacationRequest, VacationStatus]); //TODO: Add models here
      await sequelize.sync();
      return sequelize;
   },
}];
