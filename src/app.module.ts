import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validationPipeProvider } from './common/validation-pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // 파일의 경로 설정
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [validationPipeProvider],
})
export class AppModule {}
