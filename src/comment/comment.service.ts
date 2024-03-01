import { Injectable, NotFoundException } from '@nestjs/common';
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
    createCommentDto: CreateCommentDto,
    userId: number,
    postId: number,
  ) {
    return this.commentRepository.save({
      createCommentDto,
      user: { id: userId },
      post: { id: postId },
    });
  }

  async update(
    updateCommentDto: UpdateCommentDto,
    userId: number,
    commentId: number,
  ) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
      user: { id: userId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }

    return this.commentRepository.save(comment);
  }

  async remove(userId: number, commentId: number) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
      user: { id: userId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = 'This comment has been removed';

    return this.commentRepository.save(comment);
  }
}
