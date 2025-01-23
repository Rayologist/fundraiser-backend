import { CreateUserUseCase } from '@domains/fundraiser/user/application/create-user/create-user.use-case';
import { FindUserUseCase } from '@domains/fundraiser/user/application/find-user/find-user.use-case';
import { UserDto } from '@domains/fundraiser/user/infrastructure/mappers/user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async findOrCreateUser(userDto: Omit<UserDto, 'id' | 'refreshToken'>) {
    const user = await this.findUserUseCase.execute({ email: userDto.email });

    if (user.isOk()) {
      return user.value;
    }

    const createdUser = await this.createUserUseCase.execute(userDto);

    if (createdUser.isErr()) {
      throw createdUser.error;
    }

    const userOrError = await this.findUserUseCase.execute({
      email: userDto.email,
    });

    if (userOrError.isErr()) {
      throw userOrError.error;
    }

    return userOrError.value;
  }
}
