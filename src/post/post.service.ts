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

  create(postCreateDto: PostCreateDto) {
    return this.postRepository.save(postCreateDto);
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  update(id: number, postUpdateDto: PostUpdateDto) {
    return this.postRepository.update(id, postUpdateDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
