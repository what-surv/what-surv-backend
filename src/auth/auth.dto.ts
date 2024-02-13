import { IsString } from 'class-validator';
import { Role } from './role/role';

export class AuthLoginDto {
  constructor(
    readonly provider: string,
    readonly providerId: string,
    readonly email: string,
  ) {}
}

export class AuthSignUpDto {
  public role?: Role;
  @IsString()
  public nickname?: string;
  @IsString()
  public gender?: string;
  @IsString()
  public job?: string;
  public birthDate?: Date;
}
