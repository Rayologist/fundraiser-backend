import { Collection } from '@common/ddd';
import { CartItem } from '../entities/cart-item.entity';

export class CartItemCollection extends Collection<CartItem> {
  isSameItem(a: CartItem, b: CartItem): boolean {
    return a.equals(b);
  }
}
