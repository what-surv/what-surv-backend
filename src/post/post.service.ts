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

  async findRecentWithAuthorCommentLikes(
    page: number,
    limit: number,
    userId: number,
  ) {
    const countQuery = this.postRepository
      .createQueryBuilder('post')
      .select('COUNT(DISTINCT post.id)', 'count');

    const totalCountResult = await countQuery.getRawOne();
    const totalPosts = parseInt(totalCountResult.count, 10);
    const totalPages = Math.ceil(totalPosts / limit);

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.likes', 'like')
      .select('post.id', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.content', 'content')
      .addSelect('author.nickname', 'authorNickname')
      .addSelect('author.id', 'authorId')
      .addSelect('COUNT(comment.id)::int', 'commentCount')
      .addSelect('COUNT(like.id)::int', 'likeCount')
      .addSelect('post.created_at', 'createdAt')
      .addSelect('post.end_date', 'endDate')
      .addSelect('post.view_count', 'viewCount')
      .groupBy('post.id')
      .addGroupBy('author.id');

    if (!isNil(userId)) {
      query
        .leftJoin('post.likes', 'userLike', 'userLike.user = :userId', {
          userId,
        })
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN true ELSE false END',
          'isLiked',
        )
        .addGroupBy('userLike.id');
    }

    query
      .orderBy('post.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    return {
      data: await query.getRawMany(),
      totalPosts,
      totalPages,
      currentPage: page,
    };
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
