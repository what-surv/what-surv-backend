import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content!: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  /* dto는 entity의 필드와 같이 데이터베이스의 스네이크 케이스에 맞추는 것이 좋습니다! */
  /* 이유는 dto를 사용해서 받아오는 body의 키가 save나 insert로 바로 들어가기 떄문에 그렇습니다. */
  parent_id?: number;
}
