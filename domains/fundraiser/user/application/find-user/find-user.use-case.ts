import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto, UserMapper } from '../../infrastructure/mappers/user.mapper';
import { AbstractUserRepository } from '../../domain/interfaces/user.repository';
import { UserDomain } from '../../infrastructure/user.repository';

type FindUserInput =
  | {
      id: string;
    }
  | {
      email: string;
    };

type FindUserOutput = Result<UserDto, HttpException>;

@Injectable()
export class FindUserUseCase implements Query<FindUserInput, FindUserOutput> {
  constructor(
    @Inject(UserDomain.Repository)
    private readonly userRepository: AbstractUserRepository,
  ) {}

  async execute(input: FindUserInput) {
    if ('email' in input) {
      const user = await this.userRepository.findOneByEmail(input.email);
      if (!user) {
        return Result.Err(new NotFoundException('User not found'));
      }

      return Result.Ok(UserMapper.toDto(user));
    }

    if ('id' in input) {
      const user = await this.userRepository.findOneById(input.id);
      if (!user) {
        return Result.Err(new NotFoundException('User not found'));
      }

      return Result.Ok(UserMapper.toDto(user));
    }

    return Result.Err(new NotFoundException('User not found'));
  }
}
