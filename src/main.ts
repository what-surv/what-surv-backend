import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { morganSetup } from './common/morgan/morgan.setup';
import { BaseAPIDocument } from './config/swagger.documents';

Error.stackTraceLimit = Infinity;

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
const logger = new Logger('bootstrap');
logger.log(`Application is running in ${process.env.NODE_ENV} mode`);

dotenv.config({ path: envFilePath });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    morganSetup(app);
  }

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
