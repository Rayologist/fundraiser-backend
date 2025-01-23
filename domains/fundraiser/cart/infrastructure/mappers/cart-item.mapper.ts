import { CartItem } from '@modules/postgres/entities/cart-item.entity';
import { CartItem as CartItemEntity } from '../../domain/entities/cart-item.entity';
import { Currency } from '@common/ddd/money';

export interface CartItemDto {
  id: string;
  quantity: number;
  price: number;
  productId: string;
}

export class CartItemMapper {
  static toDto(cartItem: CartItemEntity): CartItemDto {
    return {
      id: cartItem.id.value,
      price: cartItem.price.value,
      quantity: cartItem.quantity.value,
      productId: cartItem.productId.value,
    };
  }

  static toDomain(args: {
    cartItem: CartItem;
    currency: Currency;
  }): CartItemEntity {
    const { cartItem, currency } = args;
    return CartItemEntity.from({
      id: cartItem.id,
      quantity: cartItem.quantity,
      productId: cartItem.productId,
      currency,
      price: cartItem.price,
      userId: cartItem.userId,
    }).value;
  }

  static toPersistence(input: CartItemEntity): CartItem {
    return new CartItem({
      id: input.id.value,
      quantity: input.quantity.value,
      productId: input.productId.value,
      price: input.price.value,
      userId: input.userId.value,
    });
  }
}
