import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthLoginDto, AuthSignUpDto } from './auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public, isNil } from 'src/common/utils';
import { AuthService } from './auth.service';
import { CustomJwtGuard } from './custom-jwt.guard';
import { SignInDto, signInDtoBodyOptions } from './dto/sign-in.dto';
import { UserService } from 'src/user/user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/sign-up')
  async signUp(@Req() req: Request, @Body() authSignUpDto: AuthSignUpDto) {
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

      const user = await this.authService.makeUser(payload, authSignUpDto);

      this.authService.signUp(user);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('jwt expired');
      }
      console.error(e);
    }
  }

  @Public()
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/google')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const { provider, providerId, email } = req.user as AuthLoginDto;

      const user = await this.userService.findUserByProviderId(providerId);

      if (user) {
        res.cookie('Authentication', 'token', {
          httpOnly: true,
          secure: false,
        });
        res.redirect('/to-front/success');
        return;
      }

      const tmp_token = this.authService.tempSignUp(
        provider,
        providerId,
        email,
      );
      res.cookie('info', (await tmp_token).tmp_token, {
        httpOnly: true,
        secure: false,
      });
      res.redirect('/to-front/fail');
      return;
    }
  }

  @Public()
  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/naver')
  @UseGuards(AuthGuard('naver'))
  async callbackNaver(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const { provider, providerId, email } = req.user as AuthLoginDto;

      const user = await this.userService.findUserByProviderId(providerId);

      if (user) {
        res.cookie('Authentication', 'token', {
          httpOnly: true,
          secure: false,
        });
        res.redirect('/to-front/success');
        return;
      }

      const tmp_token = this.authService.tempSignUp(
        provider,
        providerId,
        email,
      );
      res.cookie('info', (await tmp_token).tmp_token, {
        httpOnly: true,
        secure: false,
      });
      res.redirect('/to-front/fail');
      return;
    }
  }

  @Public()
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async callbackKakao(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const { provider, providerId, email } = req.user as AuthLoginDto;

      const user = await this.userService.findUserByProviderId(providerId);

      if (user) {
        res.cookie('Authentication', 'token', {
          httpOnly: true,
          secure: false,
        });
        res.redirect('/to-front/success');
        return;
      }

      const tmp_token = this.authService.tempSignUp(
        provider,
        providerId,
        email,
      );
      res.cookie('info', (await tmp_token).tmp_token, {
        httpOnly: true,
        secure: false,
      });
      res.redirect('/to-front/fail');
      return;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Mock local sign in' })
  @ApiBody(signInDtoBodyOptions)
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign In Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { username, password } = signInDto;

    if (isNil(username) || isNil(password)) {
      throw new UnauthorizedException();
    }

    const { accessToken } = await this.authService.signIn(username, password);

    res.cookie('Authentication', accessToken, { httpOnly: true });
    res.send({ accessToken });
  }

  @ApiOperation({ summary: 'Profile' })
  @UseGuards(CustomJwtGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
