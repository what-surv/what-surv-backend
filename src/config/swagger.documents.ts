import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('SurveyIT API')
      .setDescription('SurveyIT API description')
      .setVersion('1.0.0')
      .build();
  }
}
