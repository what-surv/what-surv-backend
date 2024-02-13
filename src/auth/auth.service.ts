import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isNil } from 'src/common/utils';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto, AuthSignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
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
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async tempSignUp(provider: string, providerId: string, email: string) {
    const payload = {
      provider: provider,
      providerId: providerId,
      email: email,
    };

    return {
      tmp_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(user: User) {
    this.userService.signUp(user);
  }

  async makeUser(authLoginDto: AuthLoginDto, authSignUpDto: AuthSignUpDto) {
    const user = new User();

    user.platform = authLoginDto.provider;
    user.providerId = authLoginDto.providerId;
    user.email = authLoginDto.email;
    user.nickname = authSignUpDto.nickname;
    user.gender = authSignUpDto.gender;
    user.job = authSignUpDto.job;
    user.birthdate = authSignUpDto.birthDate;

    return user;
  }
}
