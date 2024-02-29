import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { isNil } from 'src/common/utils';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';

import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async create(req: Request, postCreateDto: CreatePostDto) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = new Post();
    post.title = postCreateDto.title;
    post.endDate = postCreateDto.endDate;
    post.gender = postCreateDto.gender;
    post.ages = postCreateDto.ages;
    post.researchType = postCreateDto.researchType;
    post.url = postCreateDto.url;
    post.procedure = postCreateDto.procedure;
    post.duration = postCreateDto.duration;
    post.content = postCreateDto.content;
    post.author = author;
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async update(req: Request, id: number, postUpdateDto: UpdatePostDto) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = await this.findOne(id);

    if (isNil(post)) {
      throw new Error('post not found');
    }

    if (post.author.id !== author.id) {
      throw new UnauthorizedException('Not the owner of Post');
    }

    return this.postRepository.update(id, postUpdateDto);
  }

  async remove(req: Request, id: number) {
    const jwtUserDto = req.user as JwtUserDto;
    const { provider, providerId } = jwtUserDto;

    const author = await this.userService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    if (isNil(author)) {
      throw new Error('User Not Exist');
    }

    const post = await this.findOne(id);

    if (isNil(post)) {
      throw new Error('post not found');
    }

    if (post.author.id !== author.id) {
      throw new UnauthorizedException('Not the owner of Post');
    }

    return this.postRepository.delete(id);
  }
}
