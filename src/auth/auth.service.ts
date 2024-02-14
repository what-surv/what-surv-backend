import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { isNil } from 'src/common/utils';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto, AuthSignUpDto } from './auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
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
      tmpToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(req: Request, authSignUpDto: AuthSignUpDto) {
    const [_type, token] = req?.headers?.authorization?.split(' ') ?? [];

    if (isNil(token)) {
      throw new UnauthorizedException('need token');
    }

    try {
      const payload: AuthLoginDto = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (
        !isNil(await this.userService.findUserByProviderId(payload.providerId))
      ) {
        throw new Error('User Already Registered');
      }

      const user = await this.makeUser(payload, authSignUpDto);

      this.userService.signUp(user);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('jwt expired');
      }
      console.error(e);
    }
  }

  // 이름 변경 필요
  async signIn2(providerId: string) {
    const user = await this.userService.findUserByProviderId(providerId);

    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      roles: user.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async makeUser(authLoginDto: AuthLoginDto, authSignUpDto: AuthSignUpDto) {
    const user = new User();

    user.provider = authLoginDto.provider;
    user.providerId = authLoginDto.providerId;
    user.email = authLoginDto.email;
    user.nickname = authSignUpDto.nickname;
    user.gender = authSignUpDto.gender;
    user.job = authSignUpDto.job;
    user.birthDate = authSignUpDto.birthDate;

    return user;
  }

  async setTokenToCookie(req: Request, res: Response) {
    if (req.user) {
      const { provider, providerId, email } = req.user as AuthLoginDto;

      const user = await this.userService.findUserByProviderId(providerId);
      const clientUrl = await this.configService.get<string>('CLIENT_URL');

      if (user) {
        const accessToken = (await this.signIn2(providerId)).accessToken;

        res.cookie('Authentication', accessToken, {
          httpOnly: true,
          secure: false,
        });
        res.redirect(`${clientUrl}/login/success`);
        return;
      }

      const tmpToken = (await this.tempSignUp(provider, providerId, email))
        .tmpToken;

      res.cookie('info', tmpToken, {
        httpOnly: true,
        secure: false,
      });
      res.redirect(`${clientUrl}/login/new-user`);
      return;
    }
    return;
  }
}
