import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

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

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;

    // TODO: change to your own DTO

    let email = undefined;

    if (emails != null && emails.length > 0) {
      const primaryEmail = emails[0];
      if (primaryEmail.verified) {
        email = primaryEmail.value;
      }
    }

    return {
      provider: 'google',
      providerId: id,
      name: name?.givenName,
      email,
    };
  }
}
