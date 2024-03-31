import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ResearchTypeEnum } from 'src/research-types/enums/research-type.enum';
import { AgeEnum } from 'src/ages/enums/age.enum';
import { Gender } from 'src/post/gender/gender';

export class CreatePostDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title!: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
  })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({
    enum: AgeEnum,
    isArray: true,
  })
  @IsEnum(AgeEnum, { each: true })
  ages!: AgeEnum[];

  @ApiProperty({
    enum: ResearchTypeEnum,
    isArray: true,
  })
  @IsEnum(ResearchTypeEnum, { each: true })
  researchTypes!: ResearchTypeEnum[];

  @ApiProperty({
    type: 'string',
    example: 'https://www.example.com',
  })
  @IsUrl()
  url!: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  procedure!: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  duration!: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @MaxLength(500)
  content!: string;
}
