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
import { Gender, IsValidGender } from 'src/post/gender';

export class PostCreateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title!: string;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @IsValidGender()
  gender!: Gender;

  @IsArray()
  @IsString({ each: true })
  ages!: string[];

  @IsString()
  researchType!: string;

  @IsUrl()
  url!: string;

  @IsString()
  procedure!: string;

  @IsString()
  duration!: string;

  @IsString()
  @MaxLength(500)
  content!: string;
}

export class PostUpdateDto extends PartialType(PostCreateDto) {}
