import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { OptionalParseIntPipe } from 'src/common/pipe/optional.parseint.pipe';
import { GetAuthUser } from 'src/common/decorators/get-auth-user.decorator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
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

  @Patch('me')
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    return this.userService.update(updateUserDto, authUser.id);
  }

  /* Added feature to read posts written by specific user */

  /* NOTICE: 공개 API라면 Querystring 반영 + Public 데코 추가 필요 */
  @Get('me/posts')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAllMyPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe)
    limit: number,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    const userId = authUser.id;
    return this.userService.findAllMyPosts({ userId, page, limit });
  }

  @Get('me/likes')
  findAllMyLikes(
    @Query('page', OptionalParseIntPipe)
    page: number,
    @Query('limit', OptionalParseIntPipe)
    limit: number,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    const userId = authUser.id;
    return this.userService.findAllMyLikes({ userId, page, limit });
  }
}
