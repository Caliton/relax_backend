import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from './core/database/db.module';
import { join } from 'path';
import { noCacheMiddleware } from './core/middlewares/no-cache';
import { DepartamentModule } from './modules/departament/departament.module';

import { CollaboratorModule } from './modules/collaborator/collaborator.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { GlobalSettingsModule } from './modules/globalSettings/globalsettings.module';
import { PeriodModule } from './modules/period/period.module';
import { PeriodStatusModule } from './modules/periodStatus/period-status.module';
import { VacationRequestModule } from './modules/vacationRequest/vacation-request.module';
import { RequestStatusModule } from './modules/requestStatus/request-status.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './core/configs/winston.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './core/interceptors/logger.interceptor';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        maxAge: 0,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    DepartamentModule,
    GlobalSettingsModule,
    ProfileModule,
    CollaboratorModule,
    PeriodModule,
    PeriodStatusModule,
    VacationRequestModule,
    RequestStatusModule,
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(noCacheMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.GET });
  }
}
