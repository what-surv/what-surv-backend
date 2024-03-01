import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
