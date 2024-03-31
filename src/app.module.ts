import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from './auth/auth.module';
import { validationPipeProvider } from './common/validation-pipe';
import { TypeormConfig } from './config/typeorm.config';
import { PostModule } from './post/post.module';
import { RoleExampleModule } from './role-example/role-example.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ResearchTypesModule } from './research-types/research-types.module';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
    }),
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    RoleExampleModule,
    PostModule,
    CommentModule,
    LikeModule,
    ResearchTypesModule,
  ],
  controllers: [],
  providers: [validationPipeProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
