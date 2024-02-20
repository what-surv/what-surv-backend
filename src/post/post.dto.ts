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
import { Gender } from './post.entity';

export class PostCreateDto {
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

export class PostUpdateDto extends PartialType(PostCreateDto) {}
