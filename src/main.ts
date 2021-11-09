import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './core/exception-filters/entity-not-found.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
