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
import { isNil } from 'src/common/utils';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request, @Body() postCreateDto: CreatePostDto) {
    return this.postService.create(req, postCreateDto);
  }

  @Public()
  @Get()
  findRecent(
    @Req() req: Request,
    /**
     * 기존 page 및 limit처럼 인자의 default 값이 적용이 되지 않습니다.
     * 떄문에 작성하신 부분에서 쿼리스트링 없을 떄 NaN 값을 받아와 예기치않은 에러가
     * 발생합니다.
     * 이유는 다음과 같습니다.
     * @Query 데코레이터 함수 구성을 보면 지정 타입에 따라 값을 교체합니다.
     * 즉, 자바스크립트가 지원하는 default를 무시하게 되어서
     * pipe를 통해 transform 하였습니다.
     * NestJS의 권장사항에 따라 커스텀 파이프 new 연산자를 피하기 위해 static 메서드
     * 생성하여 default 세팅하도록 했습니다. 기본 값 1입니다.
     * 이 코멘트는 머지 시 삭제 혹은 간소화 되어야 합니다!
     */
    @Query('page', OptionalParseIntPipe)
    page: number,
    @Query('limit', OptionalParseIntPipe.defaultValue(10))
    limit: number,
  ) {
    const maxLimit = limit > 30 ? 30 : limit;

    if (isNil(req.user)) {
      return this.postService.findRecent(page, maxLimit);
    }

    const jwtUserDto = req.user as JwtUserDto;
    const userId = jwtUserDto?.id ?? undefined;
    return this.postService.findRecentWithLikes(page, maxLimit, userId);
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
