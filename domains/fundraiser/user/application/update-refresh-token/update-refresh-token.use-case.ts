import { Command, Result } from '@common/ddd';
import { AbstractUserRepository } from '../../domain/interfaces/user.repository';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserDomain } from '../../infrastructure/user.repository';

export type UpdateRefreshTokenInput = { userId: string };
export type UpdateRefreshTokenOutput = Result<{ token: string }, HttpException>;

@Injectable()
export class UpdateRefreshTokenUseCase
  implements Command<UpdateRefreshTokenInput, UpdateRefreshTokenOutput>
{
  constructor(
    @Inject(UserDomain.Repository)
    private readonly userRepository: AbstractUserRepository,
  ) {}

  async execute(input: UpdateRefreshTokenInput) {
    try {
      const user = await this.userRepository.findOneById(input.userId);

      if (!user) {
        return Result.Err(new NotFoundException('User not found'));
      }

      const result = user.updateRefreshToken();

      if (result.isErr()) {
        return Result.Err(new InternalServerErrorException(result.error));
      }

      await this.userRepository.save(user);

      return Result.Ok({ token: user.refreshToken.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
