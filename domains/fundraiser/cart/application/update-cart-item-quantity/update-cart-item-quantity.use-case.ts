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

export type UpdateCartItemInput = {
  userId: string;
  cartItemId: string;
  price?: number;
  quantity?: number;
};
export type UpdateCartItemOutput = Result<null, HttpException>;

@Injectable()
export class UpdateCartItemUseCase
  implements Command<UpdateCartItemInput, UpdateCartItemOutput>
{
  constructor(
    @Inject(CartDomain.Repository)
    private readonly cartRepository: AbstractCartRepository,
  ) {}

  async execute(input: UpdateCartItemInput) {
    try {
      const cart = await this.cartRepository.findOneById(input.userId);
      if (!cart) {
        return Result.Err(new NotFoundException('Cart not found'));
      }

      const cartItemOrError = cart.getItem({ id: input.cartItemId });

      if (cartItemOrError.isErr()) {
        return Result.Err(new NotFoundException(cartItemOrError.error));
      }

      const cartItem = cartItemOrError.value;

      if (!(input.price || input.quantity)) {
        return Result.Err(
          new BadRequestException('Price or quantity is required'),
        );
      }

      if (input.quantity) {
        const changeQuantityResult = cartItem.changeQuantity(input.quantity);

        if (changeQuantityResult.isErr()) {
          return Result.Err(
            new BadRequestException(changeQuantityResult.error),
          );
        }
      }

      if (input.price) {
        const changePriceResult = cartItem.changePrice(input.price);
        if (changePriceResult.isErr()) {
          return Result.Err(new BadRequestException(changePriceResult.error));
        }
      }

      await this.cartRepository.saveItem(cartItem);

      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
