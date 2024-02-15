import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
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

  async signUp(req: Request, authSignUpDto: AuthSignUpDto) {
    const [_type, token] = req?.headers?.authorization?.split(' ') ?? [];

    if (isNil(token)) {
      throw new UnauthorizedException('need token');
    }

    try {
      const payload: JwtUserDto = await this.jwtService.verifyAsync(token, {
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

  async signIn(providerId: string) {
    const user = await this.userService.findUserByProviderId(providerId);

    if (isNil(user)) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      roles: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async makeUser(authLoginDto: JwtUserDto, authSignUpDto: AuthSignUpDto) {
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
    if (isNil(req.user)) {
      throw new UnauthorizedException();
    }

    const clientUrl = await this.configService.get<string>('CLIENT_URL');

    const { provider, providerId, email } = req.user as JwtUserDto;

    const user = await this.userService.findUserByProviderId(providerId); // TODO: check both provider & providerId

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
