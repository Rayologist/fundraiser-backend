import { Command, Result } from '@common/ddd';
import { AbstractUserRepository } from '../../domain/interfaces/user.repository';
import { CreateUserProps, User } from '../../domain/user.aggregate-root';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDomain } from '../../infrastructure/user.repository';

export type CreateUserInput = CreateUserProps;
export type CreateUserOutput = Result<{ id: string }, HttpException>;

@Injectable()
export class CreateUserUseCase
  implements Command<CreateUserInput, CreateUserOutput>
{
  constructor(
    @Inject(UserDomain.Repository)
    private readonly userRepository: AbstractUserRepository,
  ) {}

  async execute(input: CreateUserInput) {
    try {
      const user = User.create(input);

      if (user.isErr()) {
        return Result.Err(new BadRequestException(user.error));
      }

      await this.userRepository.save(user.value);

      return Result.Ok({ id: user.value.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
