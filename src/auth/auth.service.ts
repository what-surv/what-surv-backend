import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';

import { AuthSignUpDto } from 'src/auth/dto/sign-up.dto';
import { isNil } from 'src/common/utils';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { OAuthUserDto } from 'src/auth/dto/oauth-user.dto';
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

    const user = await User.findOne({
      where: { provider, providerId },
      withDeleted: true,
    });

    if (!isNil(user)) {
      if (isNil(user.deletedAt)) {
        throw new UnauthorizedException(
          `User already exists: ${provider}, ${providerId}, ${email}`,
        );
      }

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (user.deletedAt && user.deletedAt > sevenDaysAgo) {
        throw new UnauthorizedException(
          `User cannot be re-signed up within 7 days: ${provider}, ${providerId}, ${email}`,
        );
      }
    }

    return this.userService.create({
      jwtUserDto,
      authSignUpDto,
      returningUser: user ?? undefined,
    });
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

  async issueMockSignUpToken(userDto: OAuthUserDto) {
    const { provider, providerId, email } = userDto;

    const user = await User.findOne({
      where: { provider, providerId },
    });

    if (!isNil(user)) {
      throw new UnauthorizedException(
        `User already exists: ${provider}, ${providerId}, ${email}`,
      );
    }

    const jwtUser: JwtUserDto = {
      id: -1,
      nickname: 'new user',
      provider,
      providerId,
      email,
      role: Roles.NotYetSignedUp,
    };

    const token = await this.jwtService.signAsync(jwtUser);

    return { token };
  }

  async setTokenToCookie(req: Request, res: Response) {
    if (isNil(req.user)) {
      throw new UnauthorizedException();
    }

    const clientUrl = this.configService.get<string>('CLIENT_URL');

    const { provider, providerId, email } = req.user as OAuthUserDto;

    const user = await User.findOne({
      where: { provider, providerId },
    });

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

  async refresh(refreshToken: string) {
    const payload: JwtUserDto = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    const jwtUser: JwtUserDto = {
      id: payload.id,
      nickname: payload.nickname,
      provider: payload.provider,
      providerId: payload.providerId,
      email: payload.email,
      role: payload.role,
    };

    const token = this.jwtService.sign(jwtUser, {
      expiresIn: process.env.JWT_REFRESH_TIME,
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return token;
  }

  async mockSignIn(id: number): Promise<{ accessToken: string }> {
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
    const { provider, providerId } = jwtUserDto;
    this.logger.log(`provider: ${provider}, providerId: ${providerId}`);

    const user = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    await this.userService.remove(user);
  }
}
