import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthSignUpDto } from 'src/auth/dto/sign-up.dto';
import { Public } from 'src/auth/role/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CustomJwtGuard } from './custom-jwt.guard';
import { JwtUserDto } from './dto/jwt-user.dto';
import { signInDtoBodyOptions } from './dto/mock-sign-in.dto';
import { OAuthUserDto, ProfileResponseDto } from './dto/oauth-user.dto';
import { Roles } from './role/role';
import { RequireRoles } from './role/role.decorator';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @RequireRoles(Roles.NotYetSignedUp)
  @Post('/sign-up')
  async signUp(
    @Req() req: Request,
    @Body() authSignUpDto: AuthSignUpDto,
    @Res() res: Response,
  ) {
    const newTempUserDto = req.user as JwtUserDto;
    const user = await this.authService.signUp(newTempUserDto, authSignUpDto);
    const jwtUser: JwtUserDto = {
      id: user.id,
      nickname: user.nickname,
      provider: user.provider,
      providerId: user.providerId,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(jwtUser);
    res.cookie('Authentication', token, { httpOnly: true });
    res.send(user);
  }

  @Public()
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginGoogle(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/google')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@Req() req: Request, @Res() res: Response) {
    return this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @Post('/mock-signup/issue-token')
  async mockSignUpToken(@Body() body: OAuthUserDto, @Res() res: Response) {
    const { token } = await this.authService.issueMockSignUpToken(body);
    res.cookie('Authentication', token, { httpOnly: true });
    return res.json({ token });
  }

  @Public()
  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginNaver(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/naver')
  @UseGuards(AuthGuard('naver'))
  async callbackNaver(@Req() req: Request, @Res() res: Response) {
    return this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginKakao(@Req() _req: Request, @Res() _res: Response) {}

  @Public()
  @Get('/callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async callbackKakao(@Req() req: Request, @Res() res: Response) {
    return this.authService.setTokenToCookie(req, res);
  }

  @Public()
  @ApiOperation({ summary: '토큰 갱신' })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }, res: Response) {
    const { refreshToken } = body;
    const newToken = await this.authService.refresh(refreshToken);

    res.cookie('Authentication', newToken, {
      httpOnly: true,
      secure: false,
    });
    return newToken;
  }

  @Public()
  @ApiOperation({ summary: 'Mock local sign in' })
  @ApiBody(signInDtoBodyOptions)
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign In Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('mock-login/:id')
  async mockSignIn(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { accessToken } = await this.authService.mockSignIn(id);

    res.cookie('Authentication', accessToken, { httpOnly: true });
    res.send({ accessToken });
  }

  @ApiOperation({ summary: 'Profile' })
  @UseGuards(CustomJwtGuard)
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request): ProfileResponseDto {
    const { id, nickname, email } = req.user as JwtUserDto;
    return { id, nickname, email };
  }

  @RequireRoles(Roles.NotYetSignedUp)
  @Get('/new-user/profile')
  isNotYetSignedUp(@Req() req: Request): ProfileResponseDto {
    const { id, nickname, email } = req.user as JwtUserDto;
    return { id, nickname, email };
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.json({ message: 'Logout Success' });
  }

  @Post('/quit')
  @HttpCode(HttpStatus.OK)
  async quit(@Req() req: Request, @Res() res: Response) {
    const jwtUserDto = req.user as JwtUserDto;
    res.clearCookie('Authentication');
    await this.authService.quit(jwtUserDto);
    return res.json({ message: 'Quit Success' });
  }
}
