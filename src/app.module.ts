import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from './auth/auth.module';
import { validationPipeProvider } from './common/validation-pipe';
import { TypeormConfig } from './config/typeorm.config';
import { RoleExampleModule } from './role-example/role-example.module';
import { UserModule } from './user/user.module';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
    }),
    ConfigModule.forRoot({
      envFilePath: envFilePath,
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
