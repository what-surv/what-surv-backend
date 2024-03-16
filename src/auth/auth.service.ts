import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';

import { AuthSignUpDto } from 'src/auth/dto/sign-up.dto';
import { isNil } from 'src/common/utils';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Roles } from './role/role';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(jwtUserDto: JwtUserDto, authSignUpDto: AuthSignUpDto) {
    const { provider, providerId, email } = jwtUserDto;
    if (
      await this.userService.findByProviderAndProviderId(provider, providerId)
    ) {
      throw new UnauthorizedException('User Already Registered');
    }

    const { nickname, gender, birthDate } = authSignUpDto;

    const user = new User();
    user.role = Roles.User;
    user.provider = provider;
    user.providerId = providerId;
    user.email = email;
    user.nickname = nickname;
    user.gender = gender;
    user.birthDate = birthDate;
    // TODO: user phone?

    return this.userService.save(user);
  }

  async signIn(provider: string, providerId: string) {
    const user = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    // payload에 뭘 담아줘야 할까요
    const payload = {
      id: user.id,
      roles: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async setTokenToCookie(req: Request, res: Response) {
    if (isNil(req.user)) {
      throw new UnauthorizedException();
    }

    const clientUrl = this.configService.get<string>('CLIENT_URL');

    const { provider, providerId, email } = req.user as JwtUserDto;

    const user = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    const jwtUser: JwtUserDto = {
      id: user?.id ?? -1,
      nickname: user?.nickname ?? 'new user',
      provider,
      providerId,
      email,
      role: user?.role ?? Roles.NotYetSignedUp,
    };

    const token = await this.jwtService.signAsync(jwtUser);

    const redirectPath = isNil(user) ? '/login/new-user' : '/login/success';
    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: false,
    });
    return res.redirect(`${clientUrl}${redirectPath}`);
  }

  async mockSignIn(
    username: string,
    pass: string,
    id: number,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findById(id);
    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    const { providerId, provider, nickname, email, role }: JwtUserDto = user;

    const payload: JwtUserDto = {
      id,
      provider,
      providerId,
      nickname,
      email,
      role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async quit(jwtUserDto: JwtUserDto) {
    const user = await this.userService.findByProviderAndProviderId(
      jwtUserDto.provider,
      jwtUserDto.providerId,
    );

    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    await this.userService.remove(user);
  }
}
