import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UserCreateDto } from './user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 구글 로그인
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() _req: Request, @Res() _res: Response) {}

  // 구글 로그인 redirect
  @Get('/callback/google')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@Req() req: Request, @Res() _res: Response) {
    // Todo: 에러처리 및 로직 수정
    if (req.user) {
      const { provider, providerId, email } = req.user as UserCreateDto;

      // 조회
      const user = await this.userService.findUserByProviderId(providerId);

      if (user) {
        console.log('USER EXISTS');
        return;
      }

      const newUser = new UserCreateDto(provider, providerId, email);
      // 저장
      this.userService.createUser(newUser);
      console.log('USER REGISTERED!');
    }

    // 리다이렉트
    // res.redirect('/frontURL');
  }
}
