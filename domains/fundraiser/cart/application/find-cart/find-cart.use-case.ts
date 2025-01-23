import { Query, Result } from '@common/ddd';
import { CartDto, CartMapper } from '../../infrastructure/mappers/cart.mapper';
import {
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { AbstractCartRepository } from '../../domain/interfaces/cart.repository';
import { CartDomain } from '../../infrastructure/cart.repository';
import { Cart } from '../../domain/cart.aggregate-root';

export type FindCartInput = { userId: string };
export type FindCartOutput = Result<CartDto, HttpException>;

export class FindCartUseCase implements Query<FindCartInput, FindCartOutput> {
  constructor(
    @Inject(CartDomain.Repository)
    private readonly cartRepository: AbstractCartRepository,
  ) {}

  async execute(input: FindCartInput): Promise<FindCartOutput> {
    try {
      const cart = await this.cartRepository.findOneById(input.userId);

      if (!cart) {
        const c = Cart.create({ userId: input.userId });
        return Result.Ok(CartMapper.toDto(c.value));
      }

      return Result.Ok(CartMapper.toDto(cart));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
