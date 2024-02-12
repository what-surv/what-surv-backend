import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from './auth/auth.module';
import { validationPipeProvider } from './common/validation-pipe';
import { RoleExampleModule } from './role-example/role-example.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig, // TODO: typeorm 설정한 클래스
    }),
    ConfigModule.forRoot({
      envFilePath: '.env', // 파일의 경로 설정
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    RoleExampleModule,
  ],
  controllers: [],
  providers: [validationPipeProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
