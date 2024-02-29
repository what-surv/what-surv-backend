import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { isNil } from 'src/common/utils';
import { OAuthUserDto } from '../dto/oauth-user.dto';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      // 환경 변수로 빼야함
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const { id, emails } = profile;

    let email;

    if (emails != null && emails.length > 0) {
      const primaryEmail = emails[0];
      if (primaryEmail.verified) {
        email = primaryEmail.value;
      }
    }

    if (isNil(email)) {
      throw new Error('email undefined');
    }

    const user: OAuthUserDto = new OAuthUserDto('google', id, email);
    return user;
  }
}
