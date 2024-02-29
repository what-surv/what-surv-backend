import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/auth.dto';
import { Public } from 'src/auth/role/public.decorator';
import { OptionalParseIntPipe } from 'src/user/pipe/optional.parseint.pipe';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('nickname-exists')
  async nicknameExists(@Query('nickname') nickname: string) {
    return this.userService.nicknameExists(nickname);
  }

  /* Added feature to read posts written by specific user */

  /* NOTICE: 공개 API라면 Querystring 반영 + Public 데코 추가 필요 */
  @Get('me/posts')
  findAllMyPosts(
    @Req() req: Request,
    @Query('page', OptionalParseIntPipe)
    page: number,
  ) {
    const user = req.user as JwtUserDto;

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userService.findAllMyPosts(user, page);
  }
}
