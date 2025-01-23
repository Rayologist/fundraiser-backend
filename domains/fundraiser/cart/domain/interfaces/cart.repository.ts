import { AbstractRepository } from '@common/ddd';
import { Cart as CartAggregateRoot } from '../cart.aggregate-root';
import { CartItem as CartItemEntity } from '../entities/cart-item.entity';

export interface AbstractCartRepository
  extends AbstractRepository<CartAggregateRoot> {
  saveItem(cartItem: CartItemEntity): Promise<void>;
}
