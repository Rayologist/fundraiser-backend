import { Command, Result } from '@common/ddd';
import { AbstractCartRepository } from '../../domain/interfaces/cart.repository';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartDomain } from '../../infrastructure/cart.repository';

export type RemoveCartItemsInput = { userId: string; cartItemIds: string[] };
export type RemoveCartItemOutput = Result<null, HttpException>;

@Injectable()
export class RemoveCartItemUseCase
  implements Command<RemoveCartItemsInput, RemoveCartItemOutput>
{
  constructor(
    @Inject(CartDomain.Repository)
    readonly cartRepository: AbstractCartRepository,
  ) {}

  async execute(input: RemoveCartItemsInput) {
    try {
      const cart = await this.cartRepository.findOneById(input.userId);

      if (!cart) {
        return Result.Err(new NotFoundException('Cart not found'));
      }

      const results = Result.all(
        input.cartItemIds.map((cartItemId) =>
          cart.removeItem({ id: cartItemId }),
        ),
      );

      if (results.isErr()) {
        return Result.Err(new BadRequestException(results.error));
      }

      await this.cartRepository.save(cart);

      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
