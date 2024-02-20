import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender, Post } from './entities/post.entity';

class PostDto extends PartialType(Post) {
  title!: string; // 제목
  enddate!: Date; // 마감일
  gender!: Gender; // 성별
  age!: string[]; // 연령
  researchType!: string; // 리서치 종류
  link!: string; // 링크
  procedure!: string; // 진행방식
  time!: string; // 소요 시간
  content!: string; // 본문
}

export class PostCreateDto implements PostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title!: string;

  @Type(() => Date)
  @IsDate()
  enddate!: Date;

  gender!: Gender;

  @IsArray()
  @IsString({ each: true })
  age!: string[];

  @IsString()
  researchType!: string;

  @IsUrl()
  link!: string;

  @IsString()
  procedure!: string;

  @IsString()
  time!: string;

  @IsString()
  @MaxLength(500)
  content!: string;
}

export class PostUpdateDto extends PartialType(PostDto) {}
