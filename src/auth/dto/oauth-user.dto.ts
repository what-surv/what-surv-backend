export class OAuthUserDto {
  constructor(
    readonly provider: string,
    readonly providerId: string,
    readonly email: string,
  ) {}
}

export interface ProfileResponseDto {
  nickname: string;
  email: string;
}
