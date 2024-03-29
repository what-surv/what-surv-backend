import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { Public } from 'src/auth/role/public.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('/posts/:postId/comments')
export class PostCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get()
  async findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.findAll(postId);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const jwtUserDto = req.user as JwtUserDto;

    return this.commentService.create(createCommentDto, jwtUserDto.id, postId);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const jwtUserDto = req.user as JwtUserDto;
    return this.commentService.update({
      updateCommentDto,
      commentId: id,
      userId: jwtUserDto.id,
    });
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const jwtUserDto = req.user as JwtUserDto;

    return this.commentService.remove({
      commentId: id,
      userId: jwtUserDto.id,
    });
  }
}
