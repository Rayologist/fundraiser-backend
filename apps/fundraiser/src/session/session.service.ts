import { UpdateRefreshTokenUseCase } from '@domains/fundraiser/user/application/update-refresh-token/update-refresh-token.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(
    private readonly _updateRefreshTokenUseCase: UpdateRefreshTokenUseCase,
  ) {}

  deleteSession(userId: string) {
    return this._updateRefreshTokenUseCase.execute({ userId });
  }
}
