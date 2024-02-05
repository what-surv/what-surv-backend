import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {

        super({
            // 환경 변수로 빼야함
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ["email", "profile"],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: Profile) {
        const { id, name, emails } = profile;
        
        return {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            email: emails[0].value,
        }
    }
}