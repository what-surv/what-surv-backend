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

import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { Gender, Genders } from 'src/post/gender/gender';
import { PostQueryFilter } from 'src/post/post-query-filter';
import { PostService } from 'src/post/post.service';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
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
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe)
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
