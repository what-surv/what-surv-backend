import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from './role/role';

export class OAuthUserDto {
  constructor(
    readonly provider: string,
    readonly providerId: string,
    readonly email: string,
  ) {}
}

export interface JwtUserDto {
  nickname: string;
  role: Role;
  provider: string;
  providerId: string;
  email: string;
}

export interface SignUpDto {
  nickname: string;
  phone: string;
  gender: string;
  advertisingConsent: boolean;
}

export class AuthSignUpDto implements SignUpDto {
  @IsString()
  @IsNotEmpty()
  public nickname!: string;

  @IsString()
  @IsNotEmpty()
  public phone!: string;

  @IsString()
  @IsNotEmpty()
  public gender!: string;

  @IsNotEmpty()
  public advertisingConsent!: boolean;

  @IsString()
  public job?: string;
  public role?: Role;
  public birthDate?: Date;
}

export interface ProfileResponseDto {
  nickname: string;
  email: string;
}
