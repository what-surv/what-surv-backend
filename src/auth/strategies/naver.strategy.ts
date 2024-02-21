import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { isNil } from 'src/common/utils';
import { OAuthUserDto } from '../auth.dto';

export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    // eslint-disable-next-line no-underscore-dangle
    const { email } = profile._json;

    if (isNil(email)) {
      throw new Error('email undefined');
    }
    const user: OAuthUserDto = new OAuthUserDto('naver', profile.id, email);
    return user;
  }
}
