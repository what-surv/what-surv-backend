import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { OptionalParseIntPipe } from 'src/common/pipe/optional.parseint.pipe';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('nickname-exists')
  async nicknameExists(@Query('nickname') nickname: string) {
    return this.userService.nicknameExists(nickname);
  }

  @Get('me')
  async findMe(@Req() req: Request) {
    const user = req.user as JwtUserDto;

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userService.findById(user.id);
  }

  /* Added feature to read posts written by specific user */

  /* NOTICE: 공개 API라면 Querystring 반영 + Public 데코 추가 필요 */
  @Get('me/posts')
  findAllMyPosts(
    @Req() req: Request,
    @Query('page', OptionalParseIntPipe)
    page: number,
    @Query('limit', OptionalParseIntPipe.defaultValue(30))
    limit: number,
  ) {
    const user = req.user as JwtUserDto;

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userService.findAllMyPosts(user.id, page, limit);
  }

  @Get('me/likes')
  findAllMyLikes(
    @Req() req: Request,
    @Query('page', OptionalParseIntPipe)
    page: number,
    @Query('limit', OptionalParseIntPipe.defaultValue(30))
    limit: number,
  ) {
    const user = req.user as JwtUserDto;

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userService.findAllMyLikes(user.id, page, limit);
  }
}
