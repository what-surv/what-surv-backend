import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface SignUpDto {
  nickname: string;
  phone?: string;
  gender: string;
  advertisingConsent: boolean;
}

export class AuthSignUpDto implements SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public nickname!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public gender!: string;

  @ApiProperty()
  @IsNotEmpty()
  public advertisingConsent!: boolean;

  @ApiProperty()
  @IsOptional()
  public birthDate?: Date;
}
