import { VacationRequestModule } from './modules/vacationRequest/vacationrequest.module';
import { VacationTimeModule } from './modules/vacationTime/vacationtime.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { join } from 'path';
import { PersonModule } from './modules/person/person.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { noCacheMiddleware } from './shared/middlewares/no-cache';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        maxAge: 0,
      },
    }),
    VacationRequestModule,
    VacationTimeModule,
    PersonModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule
  ],
  controllers: [
    AppController],
  providers: [
    AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(noCacheMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.GET });
  }

}
