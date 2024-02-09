import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { morganSetup } from './common/morgan/morgan.setup';
import { BaseAPIDocument } from './config/swagger.documents';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();

  morganSetup(app);

  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
