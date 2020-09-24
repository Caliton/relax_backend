import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Relax API')
    .setDescription('Just relax')
    .setVersion('1.0')
    .setBasePath('api/v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  console.log('olha isso cachorro')
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
