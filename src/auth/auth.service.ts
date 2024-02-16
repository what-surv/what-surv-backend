import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { isNil } from 'src/common/utils';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthSignUpDto, JwtUserDto } from './auth.dto';
import { Role } from './role/role';

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

    const { nickname, gender, birthDate, job } = authSignUpDto;

    const user = new User();
    user.role = Role.User;
    user.provider = provider;
    user.providerId = providerId;
    user.email = email;
    user.nickname = nickname;
    user.gender = gender;
    user.birthDate = birthDate;
    user.job = job; // TODO: is it necessary?
    // TODO: user phone?

    this.userService.save(user);
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

    const clientUrl = await this.configService.get<string>('CLIENT_URL');

    const { provider, providerId, email } = req.user as JwtUserDto;

    const user = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    const jwtUser: JwtUserDto = {
      nickname: user?.nickname || 'new user',
      provider: provider,
      providerId: providerId,
      email: email,
      role: user?.role ?? Role.NotYetSignedUp,
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
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findOneMockUser(username);

    if (isNil(user) || user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload: JwtUserDto = {
      nickname: user.username,
      provider: 'mock',
      providerId: '123412341234',
      email: 'mock@mock.com',
      role: user.roles[0],
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
