import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/auth/role/role';

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
