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
import { AuthService } from './auth.service';
import { CustomJwtGuard } from './custom-jwt.guard';
import { SignInDto, signInDtoBodyOptions } from './dto/sign-in.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 구글 로그인
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() _req: Request, @Res() _res: Response) {}

  // 구글 로그인 redirect
  @Get('/callback/google')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@Req() req: Request, @Res() _res: Response) {
    const user = req.user;

    console.log(user);
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

    const { access_token } = await this.authService.signIn(username, password);

    res.cookie('Authentication', access_token, { httpOnly: true });
    res.send({ access_token });
  }

  @ApiOperation({ summary: 'Profile' })
  @UseGuards(CustomJwtGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
