import { Gender } from 'src/post/gender/gender';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AgeEnum } from 'src/ages/enums/age.enum';
import { ResearchTypeEnum } from 'src/research-types/enums/research-type.enum';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortEnum } from 'src/sorts/enums/sort.enum';
import { Type } from 'class-transformer';

export class PostQueryFilter {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional()
  @IsEnum(SortEnum)
  @IsOptional()
  sort?: SortEnum;

  @ApiPropertyOptional()
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional()
  @IsEnum(AgeEnum)
  @IsOptional()
  age?: AgeEnum;

  @ApiPropertyOptional()
  @IsEnum(ResearchTypeEnum)
  @IsOptional()
  researchType?: ResearchTypeEnum;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  procedure?: string;
}
