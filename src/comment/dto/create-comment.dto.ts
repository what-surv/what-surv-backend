import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  content!: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  parentId?: number;
}
