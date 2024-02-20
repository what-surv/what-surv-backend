import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCreateDto, PostUpdateDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(_postCreateDto: PostCreateDto) {
    // TODO
    throw new Error('Method not implemented.');
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  update(_id: number, _postUpdateDto: PostUpdateDto) {
    // TODO
    throw new Error('Method not implemented.');
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
