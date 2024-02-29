import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(postId: number) {
    return this.commentRepository.find({
      where: {
        post: { id: postId },
      },
    });
  }

  async create(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    return this.commentRepository.save({
      ...createCommentDto,
      post: { id: postId },
      user: { id: userId },
    });
  }

  async update(
    userId: number,
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentRepository.update(
      {
        id: commentId,
        post: { id: postId },
        user: { id: userId },
      },
      {
        id: commentId,
        post: { id: postId },
        user: { id: userId },
        ...updateCommentDto,
      },
    );
  }

  async remove(userId: number, postId: number, commentId: number) {
    return this.commentRepository.delete({
      id: commentId,
      post: { id: postId },
      user: { id: userId },
    });
  }
}
