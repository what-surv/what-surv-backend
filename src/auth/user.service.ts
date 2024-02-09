import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserCreateDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private userCreateDtoToEntity(userCreateDto: UserCreateDto): User {
    const { provider, providerId, email } = userCreateDto;

    const userEntity = new User();

    userEntity.platform = provider;
    userEntity.providerId = providerId;
    userEntity.email = email;

    return userEntity;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByProviderId(providerId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { providerId: providerId } });
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const userEntity = this.userCreateDtoToEntity(userCreateDto);
    const newUser = this.userRepository.create(userEntity);
    return this.userRepository.save(newUser);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
