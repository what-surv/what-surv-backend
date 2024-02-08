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
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { isNil } from 'src/common/utils';
import { CustomJwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

export class SignInDto {
  @ApiProperty({ example: 'john' })
  username?: string;
  @ApiProperty({ example: 'changeme' })
  password?: string;
}

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

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign In Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const { username, password } = signInDto;

    console.log(username, password);

    if (isNil(username) || isNil(password)) {
      throw new UnauthorizedException();
    }

    return this.authService.signIn(username, password);
  }

  @ApiOperation({ summary: 'Profile' })
  @UseGuards(CustomJwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
