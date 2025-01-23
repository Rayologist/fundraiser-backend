import { JWTService } from '../jwt/jwt.service';
import { UserRepository } from '@modules/postgres/repositories/user.repository';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JWTService,
    private readonly _userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.signedCookies.tk;

    if (!cookies) {
      throw new UnauthorizedException();
    }

    const jwt = this._jwtService.verify<{ refreshToken: string }>(cookies);

    if (!jwt) {
      response.clearCookie('tk');
      return false;
    }

    const user = await this._userRepository.findOneById(jwt?.sub);

    if (!user) {
      response.clearCookie('tk');
      return false;
    }

    if (user.refreshToken !== jwt.refreshToken) {
      response.clearCookie('tk');
      return false;
    }

    request.context = {
      user,
    };

    return true;
  }
}
