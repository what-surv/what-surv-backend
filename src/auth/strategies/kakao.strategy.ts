import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { isNil } from 'src/common/utils';
import { OAuthUserDto } from '../auth.dto';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    // eslint-disable-next-line no-underscore-dangle
    const { email } = profile._json.kakao_account;

    if (isNil(email)) {
      throw new Error('email undefined');
    }

    const user: OAuthUserDto = new OAuthUserDto('kakao', profile.id, email);
    return user;
  }
}
