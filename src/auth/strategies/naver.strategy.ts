import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthLoginDto } from '../auth.dto';

export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = profile._json.email;

    const user: AuthLoginDto = new AuthLoginDto('naver', profile.id, email!);
    return user;
  }
}
