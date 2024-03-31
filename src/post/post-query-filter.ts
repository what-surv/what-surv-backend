import { Gender } from 'src/post/gender/gender';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AgeEnum } from 'src/ages/enums/age.enum';
import { ResearchTypeEnum } from 'src/research-types/enums/research-type.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortEnum } from 'src/sorts/enums/sort.enum';

export class PostQueryFilter {
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
