import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.DB_USER_NAME_DEVELOPMENT,
        password: process.env.DB_PASS_NAME_DEVELOPMENT,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST_DEVELOPMENT,
        port: process.env.DB_PORT_DEVELOPMENT,
        dialect: process.env.DB_DIALECT_DEVELOPMENT,
    },
    test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASS_TEST,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST_TEST,
        port: process.env.DB_PORT_TEST,
        dialect: process.env.DB_DIALECT_TEST,
    },
    production: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '@preta',
        database: process.env.DB_NAME_PRODUCcocaTION || 'relax_db',
        host: process.env.DB_HOST || '35.247.245.15',
        dialect: process.env.DB_DIALECT || 'mysql',
    },
};