import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { isNil } from 'src/common/utils';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';

import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async create(req: Request, postCreateDto: CreatePostDto) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = new Post();
    post.title = postCreateDto.title;
    post.endDate = postCreateDto.endDate;
    post.gender = postCreateDto.gender;
    post.ages = postCreateDto.ages;
    post.researchType = postCreateDto.researchType;
    post.url = postCreateDto.url;
    post.procedure = postCreateDto.procedure;
    post.duration = postCreateDto.duration;
    post.content = postCreateDto.content;
    post.author = author;
    return this.postRepository.save(post);
  }

  /**
   * Retrieves a paginated list of the most recent posts, including information about whether each post has been liked by a specific user.
   *
   * @param page The current page number for pagination. The first page is 1.
   * @param limit The number of posts to return per page. Helps in controlling the size of data returned.
   * @param userId The ID of the user for whom the 'like' status of each post is being checked. This ID is used to determine if the user has liked each post.
   */
  async findRecentWithLikes(page: number, limit: number, userId: number) {
    const count = await this.postRepository.count();
    const qb = this.postRepository.createQueryBuilder('post');
    const data = await qb
      .leftJoin('post.likes', 'like')
      .leftJoin('like.user', 'user')
      .addSelect((subQuery) => {
        /* 서브쿼리로 sql injection 문제 보완하였습니다. */
        return subQuery
          .select(
            'CASE WHEN COUNT(like.id) > 0 THEN true ELSE false END',
            'isLiked',
          )
          .from('like', 'like')
          .where('like.post_id = post.id')
          .andWhere('like.user_id = :userId', { userId });
      }, 'isLiked')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();
    return [data, count];
  }

  async findRecent(page: number, limit: number) {
    const [data, count] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });

    return { data, count };
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async update(req: Request, id: number, postUpdateDto: UpdatePostDto) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = await this.findOne(id);

    if (isNil(post)) {
      throw new Error('post not found');
    }

    if (post.author.id !== author.id) {
      throw new UnauthorizedException('Not the owner of Post');
    }

    return this.postRepository.update(id, postUpdateDto);
  }

  async remove(req: Request, id: number) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = await this.findOne(id);

    if (isNil(post)) {
      throw new Error('post not found');
    }

    if (post.author.id !== author.id) {
      throw new UnauthorizedException('Not the owner of Post');
    }

    return this.postRepository.delete(id);
  }

  async incrementViewCount(id: number) {
    return this.postRepository.increment({ id }, 'viewCount', 1);
  }
}
