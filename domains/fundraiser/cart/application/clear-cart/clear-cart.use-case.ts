import { Command, Result } from '@common/ddd';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AbstractCartRepository } from '../../domain/interfaces/cart.repository';
import { CartDomain } from '../../infrastructure/cart.repository';

export type ClearCartInput = {
  userId: string;
};

export type ClearCartOutput = Result<null, HttpException>;

@Injectable()
export class ClearCartUseCase
  implements Command<ClearCartInput, ClearCartOutput>
{
  constructor(
    @Inject(CartDomain.Repository)
    private readonly cartRepository: AbstractCartRepository,
  ) {}

  async execute(input: ClearCartInput) {
    try {
      const cart = await this.cartRepository.findOneById(input.userId);

      if (!cart) {
        return Result.Ok(null);
      }

      cart.clear();

      await this.cartRepository.save(cart);

      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
