import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role/role';

export type User = {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
};

@Injectable()
export class UserService {
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

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
