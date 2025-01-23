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
import { Currency } from '@common/ddd/money';
import { Cart } from '../../domain/cart.aggregate-root';

export type AddCartItemInput = {
  userId: string;
  productId: string;
  price: number;
  currency: Currency;
  quantity: number;
};

export type AddCartItemOutput = Result<null, HttpException>;

@Injectable()
export class AddCartItemUseCase
  implements Command<AddCartItemInput, AddCartItemOutput>
{
  constructor(
    @Inject(CartDomain.Repository)
    private readonly cartRepository: AbstractCartRepository,
  ) {}

  async execute(input: AddCartItemInput) {
    try {
      let cart = await this.cartRepository.findOneById(input.userId);

      if (!cart) {
        cart = Cart.create({ userId: input.userId }).value;
      }

      const result = cart.addItem({
        productId: input.productId,
        currency: input.currency,
        price: input.price,
        quantity: input.quantity,
      });

      if (result.isErr()) {
        return Result.Err(new BadRequestException(result.error));
      }

      await this.cartRepository.save(cart);

      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
