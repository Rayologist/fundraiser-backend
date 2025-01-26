import { env } from '@common/environments/fundraiser.env';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const header = request.headers['authorization'];

    if (!header) {
      return false;
    }

    const token = header.split(' ');

    if (token.length !== 2) {
      return false;
    }

    if (token[0] !== 'Bearer') {
      return false;
    }

    if (token[1] !== env.adminToken) {
      return false;
    }

    return true;
  }
}
