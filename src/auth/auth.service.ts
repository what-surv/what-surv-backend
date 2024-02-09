import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isNil } from 'src/common/utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);

    if (isNil(user) || user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
