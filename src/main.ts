import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { BaseAPIDocument } from './config/swagger.documents';

Error.stackTraceLimit = Infinity;
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger 설정
  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
