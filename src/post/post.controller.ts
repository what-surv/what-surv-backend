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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { OptionalParseIntPipe } from 'src/common/pipe/optional.parseint.pipe';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Get()
  findRecent(
    @Req() req: Request,
    @Query('page', OptionalParseIntPipe)
    page: number,
    @Query('limit', OptionalParseIntPipe.defaultValue(10))
    limit: number,
  ) {
    const maxLimit = limit > 30 ? 30 : limit;

    const jwtUserDto = req.user as JwtUserDto;
    const userId = jwtUserDto?.id ?? undefined;
    return this.postService.findRecentWithAuthorCommentLikes(
      page,
      maxLimit,
      userId,
    );
  }

  @Public()
  @Get('/popular')
  findPopular() {
    return this.postService.findPopular();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request, @Body() postCreateDto: CreatePostDto) {
    return this.postService.create(req, postCreateDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const post = this.postService.findOne(id);
    this.postService.incrementViewCount(id).catch((error) => {
      throw error;
    });
    return post;
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() postUpdateDto: UpdatePostDto,
  ) {
    return this.postService.update(req, Number(id), postUpdateDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.postService.remove(req, Number(id));
  }
}
