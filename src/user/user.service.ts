import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Role, Roles } from 'src/auth/role/role';
import { Post } from 'src/post/post.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export type MockUser = {
  userId: number;
  username: string;
  password: string;
  role: Role;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly mockUsers = [
    {
      userId: 1,
      username: 'user',
      password: 'userpw',
      role: Roles.User,
    },
    {
      userId: 2,
      username: 'admin',
      password: 'adminpw',
      role: Roles.Admin,
    },
  ];

  async findOneMockUser(username: string): Promise<MockUser | undefined> {
    return this.mockUsers.find((user) => user.username === username);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByProviderAndProviderId(provider: string, providerId: string) {
    return this.userRepository.findOne({
      where: { provider, providerId },
    });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async signUp(user: User): Promise<User> {
    await this.userRepository.save(user);
    return user;
  }

  async nicknameExists(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    return !!user;
  }

  /* Added feature to read posts written by specific user */
  async findAllMyPosts({ provider, providerId }: JwtUserDto, page: number = 1) {
    // pageSize는 프론트
    const pageSize = 30;

    const qb = this.userRepository.manager
      .getRepository(Post)
      .createQueryBuilder('post');

    const [posts, length] = await qb
      .leftJoin('post.author', 'author')
      .addSelect(['post', 'author.nickname'])
      .where('author.provider = :provider', { provider })
      .andWhere('author.provider_id = :providerId', { providerId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const total = Math.ceil(length / pageSize);

    const message =
      total < page || page <= 0
        ? 'Requested page number is out of range. Please provide a valid page number.'
        : 'success';

    return {
      message,
      posts,
      page,
      total,
    };
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
