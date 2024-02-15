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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public, isNil } from 'src/common/utils';
import { AuthSignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CustomJwtGuard } from './custom-jwt.guard';
import { MockSignInDto, signInDtoBodyOptions } from './dto/mock-sign-in.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  async signUp(@Req() req: Request, @Body() authSignUpDto: AuthSignUpDto) {
    this.authService.signUp(req, authSignUpDto);
  }

  @Public()
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/google')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@Req() req: Request, @Res() res: Response) {
    this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/naver')
  @UseGuards(AuthGuard('naver'))
  async callbackNaver(@Req() req: Request, @Res() res: Response) {
    this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async callbackKakao(@Req() req: Request, @Res() res: Response) {
    this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @ApiOperation({ summary: 'Mock local sign in' })
  @ApiBody(signInDtoBodyOptions)
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign In Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async mockSignIn(@Body() mockSignInDto: MockSignInDto, @Res() res: Response) {
    const { username, password } = mockSignInDto;

    if (isNil(username) || isNil(password)) {
      throw new UnauthorizedException();
    }

    const { accessToken } = await this.authService.mockSignIn(
      username,
      password,
    );

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
