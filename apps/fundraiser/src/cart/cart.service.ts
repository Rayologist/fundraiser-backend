import { AddCartItemUseCase } from '@domains/fundraiser/cart/application/add-cart-item/add-cart-item.use-case';
import { ClearCartUseCase } from '@domains/fundraiser/cart/application/clear-cart/clear-cart.use-case';
import { RemoveCartItemUseCase } from '@domains/fundraiser/cart/application/remove-cart-item/remove-cart-item.use-case';
import { UpdateCartItemUseCase } from '@domains/fundraiser/cart/application/update-cart-item-quantity/update-cart-item-quantity.use-case';
import { FindOneProductUseCase } from '@domains/fundraiser/product/application/find-one-product/find-one-product.use-case';
import { Injectable } from '@nestjs/common';
import { GetCartPresenter } from './presenters/cart.presenter';
import { CartItemRepository } from '@modules/postgres/repositories/cart-item.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly findOneProductUseCase: FindOneProductUseCase,
    private readonly addCartItemUseCase: AddCartItemUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly getCartPresenter: GetCartPresenter,
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  async getCart(args: { userId: string }) {
    const cartItems = await this.cartItemRepository.findManyByUserId(
      args.userId,
    );

    return this.getCartPresenter.present({
      cartItems,
    });
  }

  async addCartItem(args: { productId: string; userId: string }) {
    const product = await this.findOneProductUseCase.execute({
      id: args.productId,
    });

    if (product.isErr()) {
      throw product.error;
    }

    const result = await this.addCartItemUseCase.execute({
      productId: args.productId,
      userId: args.userId,
      price: 1000,
      currency: product.value.currency,
      quantity: 1,
    });

    if (result.isErr()) {
      throw result.error;
    }
  }

  async clearCart(args: { userId: string }) {
    const result = await this.clearCartUseCase.execute({ userId: args.userId });

    if (result.isErr()) {
      throw result.error;
    }
  }

  async removeCartItem(args: { userId: string; cartItemId: string }) {
    const result = await this.removeCartItemUseCase.execute({
      userId: args.userId,
      cartItemIds: [args.cartItemId],
    });

    if (result.isErr()) {
      throw result.error;
    }
  }

  async updateCartItem(args: {
    userId: string;
    cartItemId: string;
    price?: number;
    quantity?: number;
  }) {
    const result = await this.updateCartItemUseCase.execute({
      userId: args.userId,
      cartItemId: args.cartItemId,
      price: args.price,
      quantity: args.quantity,
    });

    if (result.isErr()) {
      throw result.error;
    }
  }
}
