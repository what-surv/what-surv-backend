import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OAuthUserDto {
  @ApiProperty()
  @IsString()
  provider!: string;

  @ApiProperty()
  @IsString()
  providerId!: string;

  @ApiProperty()
  @IsString()
  email!: string;

  constructor(provider: string, providerId: string, email: string) {
    this.provider = provider;
    this.providerId = providerId;
    this.email = email;
  }
}

export interface ProfileResponseDto {
  id: number;
  nickname: string;
  email: string;
}
