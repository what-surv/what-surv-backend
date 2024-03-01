import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentController } from 'src/comment/comment.controller';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [PostCommentController],
  providers: [CommentService],
})
export class CommentModule {}
