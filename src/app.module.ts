import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TempModule } from './temp/temp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // 파일의 경로 설정
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    TempModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
