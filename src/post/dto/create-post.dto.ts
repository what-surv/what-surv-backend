import { ApiProperty } from '@nestjs/swagger';
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

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty()
  @IsValidGender()
  gender!: Gender;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  ages!: string[];

  @ApiProperty()
  @IsString()
  researchType!: string;

  @ApiProperty()
  @IsUrl()
  url!: string;

  @ApiProperty()
  @IsString()
  procedure!: string;

  @ApiProperty()
  @IsString()
  duration!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  content!: string;
}
