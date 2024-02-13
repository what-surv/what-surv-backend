import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role/role';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export type Users = {
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
  private readonly users = [
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

  async findOne(username: string): Promise<Users | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByProviderId(providerId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { providerId: providerId },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async signUp(user: User): Promise<User> {
    await this.userRepository.save(user);
    return user;
  }
}
