import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { loadEnv } from '../../../shared/config/env';

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

/** Valida el JWT de las peticiones y expone el usuario en `request.user`. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: loadEnv().jwt.secret,
    });
  }

  validate(payload: JwtPayload): { id: number; username: string; role: string } {
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
