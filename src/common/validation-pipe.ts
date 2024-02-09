import { Provider, ValidationPipe } from '@nestjs/common';

export const validationPipeProvider: Provider = {
  provide: 'APP_PIPE',
  useFactory: () => {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });
  },
};
