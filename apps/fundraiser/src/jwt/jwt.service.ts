import { env } from '@common/environments/fundraiser.env';
import { Global, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Global()
@Injectable()
export class JWTService {
  sign(
    payload: { refreshToken: string; userId: string },
    options?: jwt.SignOptions,
  ) {
    const { userId, ...rest } = payload;
    return jwt.sign(rest, env.jwtSecret, {
      issuer: 'langcutech',
      audience: 'fund.langcute.org',
      subject: userId,
      ...options,
    });
  }

  verify<T extends Record<string, any>>(
    token: string,
  ): (jwt.JwtPayload & T) | null {
    try {
      return jwt.verify(token, env.jwtSecret) as jwt.JwtPayload & T;
    } catch (error) {
      return null;
    }
  }

  decode<T extends Record<string, any>>(
    token: string,
  ): (jwt.JwtPayload & T) | null {
    try {
      return jwt.decode(token) as jwt.JwtPayload & T;
    } catch (error) {
      return null;
    }
  }
}
