import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { isNil } from 'src/common/utils';
import { UserService } from 'src/user/user.service';

import { MoreThanOrEqual, Repository } from 'typeorm';

import { PostQueryFilter } from 'src/post/post-query-filter';

import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { Gender } from 'src/post/gender/gender';
import { SortEnum } from 'src/sorts/enums/sort.enum';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async create({
    createPostDto,
    authUser,
  }: {
    createPostDto: CreatePostDto;
    authUser: JwtUserDto;
  }) {
    const { provider, providerId } = authUser;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new InternalServerErrorException('User not exist.');
    }

    const post = Post.create({
      ...createPostDto,
      author,
    });

    return post.save();
  }

  /** 10 Popular Posts (via viewCount) in the last 7 days
   */
  async findPopular() {
    const today = new Date();

    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [data, count] = await this.postRepository.findAndCount({
      where: {
        createdAt: MoreThanOrEqual(lastWeek),
        viewCount: MoreThanOrEqual(50),
      },
      take: 10,
      relations: ['author'],
      order: {
        viewCount: 'DESC',
      },
    });

    return { data, count };
  }

  async find(param: { filter: PostQueryFilter; userId?: number }) {
    const { filter, userId } = param;

    const { page, limit, sort, gender, age, researchType, procedure } = filter;

    const qb = Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .andWhere('post.endDate >= :today', { today: new Date() });

    if (!isNil(userId)) {
      qb.leftJoinAndMapOne(
        'post.userLike',
        'post.likes',
        'like',
        'like.user = :userId',
        { userId },
      );
    }
    if (!isNil(userId)) {
      qb.leftJoin('post.likes', 'userLike', 'userLike.user = :userId', {
        userId,
      });
    }

    if (!isNil(gender) && gender !== Gender.All) {
      qb.andWhere('post.gender = :gender', { gender });
    }

    if (!isNil(age)) {
      qb.andWhere(':age = ANY(post.ages)', { age });
    }

    if (!isNil(researchType)) {
      qb.andWhere(':researchType = ANY(post.researchTypes)', { researchType });
    }

    if (!isNil(procedure)) {
      qb.andWhere(':procedure = post.procedure', { procedure });
    }

    if (sort === SortEnum.Popular) {
      qb.orderBy('post.likeCount', 'DESC');
    } else if (sort === SortEnum.Deadline) {
      qb.orderBy('post.endDate', 'ASC');
    } else {
      qb.orderBy('post.createdAt', 'DESC');
    }

    qb.offset((page - 1) * limit).limit(limit);

    const [data, totalPosts] = await qb.getManyAndCount();

    return {
      data,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  }

  async findRecentWithAuthorCommentLikes(
    page: number,
    limit: number,
    userId: number,
    queryFilter: PostQueryFilter,
  ) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.likes', 'like')
      .leftJoin('post.researchTypes', 'researchType')
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
      .addSelect(
        'ARRAY_AGG(DISTINCT researchType.name) FILTER (WHERE researchType.name IS NOT NULL)',
        'researchTypes',
      )
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

    const { sort, gender, age, researchType, procedure } = queryFilter;

    if (!isNil(gender)) {
      query.andWhere('post.gender = :gender', { gender });
    }

    if (!isNil(age)) {
      // TODO
    }

    if (!isNil(researchType)) {
      query.andWhere('post.researchType = :researchType', { researchType });
    }

    if (!isNil(procedure)) {
      query.andWhere('post.procedure = :procedure', { procedure });
    }

    if (sort === SortEnum.Popular) {
      query.orderBy('COUNT(like.id)', 'DESC');
    }
    query.addOrderBy('post.createdAt', 'DESC');

    const totalPosts = await query.getCount();
    const totalPages = Math.ceil(totalPosts / limit);

    query.offset((page - 1) * limit).limit(limit);

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

  async update(param: {
    updatePostDto: UpdatePostDto;
    postId: number;
    userId: number;
  }) {
    const { updatePostDto, postId, userId } = param;

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (isNil(post)) {
      throw new BadRequestException(`Post ${postId} not found.`);
    }

    const { author } = post;

    if (author.id !== userId) {
      throw new UnauthorizedException(
        `User ${userId} is not the author ${post.author.id} of the post.`,
      );
    }

    return Post.update(postId, updatePostDto);
  }

  async remove(param: { userId: number; postId: number }) {
    const { userId, postId } = param;

    const user = await this.userService.findById(userId);
    if (isNil(user)) {
      throw new InternalServerErrorException('User Not Exist');
    }

    const post = await Post.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (isNil(post)) {
      throw new InternalServerErrorException('Post Not Exist');
    }

    const { author } = post;

    if (author.id !== user.id) {
      throw new UnauthorizedException('Not the owner of Post');
    }

    return post.softRemove();
  }

  async incrementViewCount(id: number) {
    return this.postRepository.increment({ id }, 'viewCount', 1);
  }
}
