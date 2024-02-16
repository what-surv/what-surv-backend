import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role/role';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export type MockUser = {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
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
      roles: [Role.User],
    },
    {
      userId: 2,
      username: 'admin',
      password: 'adminpw',
      roles: [Role.User, Role.Admin],
    },
  ];

  async findOneMockUser(username: string): Promise<MockUser | undefined> {
    return this.mockUsers.find((user) => user.username === username);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByProviderAndProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });
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
    return user ? true : false;
  }
}
