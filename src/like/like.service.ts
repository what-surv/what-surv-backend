import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/like/entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async like(userId: number, postId: number) {
    return this.likeRepository.save({
      post: { id: postId },
      user: { id: userId },
    });
  }

  async unlike(userId: number, postId: number) {
    return this.likeRepository.delete({
      post: { id: postId },
      user: { id: userId },
    });
  }

  async isLiked(userId: number, postId: number) {
    return this.likeRepository.exists({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
  }
}
