import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { Request } from 'express';

import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { PostQueryFilter } from 'src/post/post-query-filter';
import { PostService } from 'src/post/post.service';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { GetAuthUser } from 'src/common/decorators/get-auth-user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    return this.postService.create({ createPostDto, authUser });
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findNormal(@Query() filter: PostQueryFilter, @Req() req: Request) {
    const user = req.user as JwtUserDto;
    const userId = user?.id ?? undefined;

    return this.postService.find({
      filter,
      userId,
    });
  }

  @Public()
  @Get('/popular')
  findPopular() {
    return this.postService.findPopular();
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: Request,
  ) {
    const user = req.user as JwtUserDto | undefined;
    const userId = user?.id;

    const post = this.postService.findOne({ postId, userId });
    await this.postService.incrementViewCount(postId);
    return post;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    return this.postService.update({
      userId: authUser.id,
      postId,
      updatePostDto,
    });
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) postId: number,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    return this.postService.remove({ userId: authUser.id, postId });
  }
}
