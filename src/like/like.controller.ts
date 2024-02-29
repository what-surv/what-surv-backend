import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/auth.dto';
import { LikeService } from './like.service';

@ApiTags('Likes')
@Controller('/posts/:postId/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async like(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const jwtUserDto = req.user as JwtUserDto;
    return this.likeService.like(jwtUserDto.id, postId);
  }

  @Get()
  async isLiked(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const jwtUserDto = req.user as JwtUserDto;
    return this.likeService.isLiked(jwtUserDto.id, postId);
  }

  @Delete()
  async unlike(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const jwtUserDto = req.user as JwtUserDto;
    return this.likeService.unlike(jwtUserDto.id, postId);
  }
}
