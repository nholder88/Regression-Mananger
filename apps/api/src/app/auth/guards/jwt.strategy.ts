import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { UserDto } from '../../Models/User.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtConstants.key
    });
  }

  async validate(payload: any) {
    const user = new UserDto();
    user.id = payload.sub;
    user.username = payload.username;

    return user;
  }
}
