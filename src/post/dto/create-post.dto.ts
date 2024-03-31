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
import { Gender, Genders } from 'src/post/gender/gender';

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

  @ApiProperty({
    enum: Genders,
    enumName: 'Gender',
  })
  @IsEnum(Genders)
  gender!: Gender;

  @ApiProperty({
    type: [String],
  })
  @IsString({ each: true })
  ages!: string[];

  @ApiProperty({
    type: [String],
  })
  @IsString({ each: true })
  researchType!: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  procedure!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  duration!: string;

  @ApiProperty({})
  @IsString()
  @MaxLength(500)
  content!: string;
}
