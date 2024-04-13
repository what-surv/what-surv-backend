import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post } from 'src/post/post.entity';
import { ILike, Repository } from 'typeorm';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/auth/role/role';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { AuthSignUpDto } from 'src/auth/dto/sign-up.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private pagination(page: number, length: number, pageSize: number) {
    const total = Math.ceil(length / pageSize);
    const message =
      total < page || page <= 0
        ? 'Requested page number is out of range. Please provide a valid page number.'
        : 'success';

    return [total, message];
  }

  async findByProviderAndProviderId(provider: string, providerId: string) {
    return this.userRepository.findOne({
      where: { provider, providerId },
    });
  }

  async create(param: {
    jwtUserDto: JwtUserDto;
    authSignUpDto: AuthSignUpDto;
    returningUser: User | undefined;
  }): Promise<User> {
    const { jwtUserDto, authSignUpDto } = param;

    const { provider, providerId, email } = jwtUserDto;
    const { nickname, phone, job, gender, birthDate, advertisingConsent } =
      authSignUpDto;

    const user = param.returningUser ?? new User();

    if (param.returningUser) {
      user.deletedAt = null as any;
    }

    user.email = email;
    user.provider = provider;
    user.providerId = providerId;

    user.role = Roles.User;
    user.nickname = nickname;
    user.gender = gender;
    user.job = job;
    user.birthDate = birthDate;
    user.phone = phone;
    user.advertisingConsent = advertisingConsent;

    return this.userRepository.save(user);
  }

  async nicknameExists(nickname: string): Promise<boolean> {
    return this.userRepository.exists({
      where: {
        nickname: ILike(nickname),
      },
    });
  }

  async findAllMyPosts(param: { userId: number; page: number; limit: number }) {
    const { userId, page, limit } = param;
    const qb = Post.createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'author', 'author.id = :userId', {
        userId,
      })
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .leftJoinAndMapOne(
        'post.userLike',
        'post.likes',
        'like',
        'like.user = :userId',
        { userId },
      )

      .orderBy('post.createdAt', 'DESC');

    qb.offset((page - 1) * limit).limit(limit);

    const [posts, totalPostCount] = await qb.getManyAndCount();

    return {
      posts,
      totalPostCount,
      totalPageCount: Math.ceil(totalPostCount / limit),
      currentPage: page,
    };
  }

  async findAllMyLikes(param: { userId: number; page: number; limit: number }) {
    const { userId, page, limit } = param;
    const qb = Post.createQueryBuilder('post')
      .innerJoin('post.likes', 'like', 'like.user = :userId', {
        userId,
      })
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .leftJoinAndMapOne(
        'post.userLike',
        'post.likes',
        'userLike',
        'userLike.user.id = :userId',
        { userId },
      )
      .orderBy('post.createdAt', 'DESC')
      .skip((param.page - 1) * param.limit)
      .take(param.limit);

    const [posts, totalPostCount] = await qb.getManyAndCount();

    return {
      posts,
      totalPostCount,
      totalPageCount: Math.ceil(totalPostCount / limit),
      currentPage: page,
    };
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(updateUserDto: UpdateUserDto, id: number) {
    const { nickname } = updateUserDto;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new InternalServerErrorException(`User ${id} not found`);
    }

    if (nickname && nickname !== user.nickname) {
      const nicknameExists = await this.nicknameExists(nickname);

      if (nicknameExists) {
        throw new Error('Nickname already exists');
      }
    }

    await User.update(id, updateUserDto);
    return User.findOne({ where: { id } });
  }

  async remove(user: User) {
    await this.userRepository.softRemove(user);
  }
}
