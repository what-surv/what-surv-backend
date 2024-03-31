import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { Gender, Genders } from 'src/post/gender/gender';
import { PostQueryFilter } from 'src/post/post-query-filter';
import { PostService } from 'src/post/post.service';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { GetAuthUser } from 'src/common/decorators/get-auth-user.decorator';
import { OptionalGenderPipe } from './gender/optional-gender.pipe';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'gender', required: false, enum: Genders })
  @ApiQuery({ name: 'age', required: false })
  @ApiQuery({ name: 'research_type', required: false })
  @ApiQuery({ name: 'procedure', required: false })
  @Get()
  findRecent(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe)
    limit: number,
    @Query('sort') sort: string,
    @Query('gender', OptionalGenderPipe)
    gender?: Gender,
    @Query('age') age?: string,
    @Query('research_type') researchType?: string,
    @Query('procedure') procedure?: string,
  ) {
    const maxLimit = limit > 30 ? 30 : limit;

    const jwtUserDto = req.user as JwtUserDto;
    const userId = jwtUserDto?.id ?? undefined;

    const queryFilter: PostQueryFilter = {
      sort,
      gender,
      age,
      researchType,
      procedure,
    };

    return this.postService.findRecentWithAuthorCommentLikes(
      page,
      maxLimit,
      userId,
      queryFilter,
    );
  }

  @Public()
  @Get('/popular')
  findPopular() {
    return this.postService.findPopular();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @GetAuthUser() authUser: JwtUserDto,
  ) {
    return this.postService.create({ createPostDto, authUser });
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
