import { CartItem } from '@modules/postgres/entities/cart-item.entity';
import { Cart as CartAggregateRoot } from '../../domain/cart.aggregate-root';
import { CartItemDto, CartItemMapper } from './cart-item.mapper';
import { Currency } from '@common/ddd/money';

export interface CartDto {
  cartItems: CartItemDto[];
}

export class CartMapper {
  static toDomain(cart: {
    userId: string;
    cartItems: (CartItem & { currency: Currency })[];
  }): CartAggregateRoot {
    return CartAggregateRoot.from({
      userId: cart.userId,
      cartItems: cart.cartItems,
    }).value;
  }

  static toDto(cart: CartAggregateRoot): CartDto {
    return {
      cartItems: cart.items.items.map((item) => CartItemMapper.toDto(item)),
    };
  }
}
