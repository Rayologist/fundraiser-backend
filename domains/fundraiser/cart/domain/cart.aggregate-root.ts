import { AggregateRoot, Result } from '@common/ddd';
import { CartId } from './value-objects/cart-id.value-object';
import { CartItemCollection } from './collections/cart-item.collection';
import { CartItem, CartItemProps } from './entities/cart-item.entity';

export type CartAggregateRootProps = {
  items: CartItemCollection;
};

export class Cart extends AggregateRoot<CartId, CartAggregateRootProps> {
  get items() {
    return this.props.items;
  }

  getItem(props: { id: string }) {
    const item = this.props.items.find((item) => item.id.value === props.id);

    if (!item) {
      return Result.Err('Item not found');
    }

    return Result.Ok(item);
  }

  addItem(props: Omit<CartItemProps, 'id' | 'userId'>) {
    const item = CartItem.create({
      ...props,
      userId: this.id.value,
    });

    if (item.isErr()) {
      return Result.Err(item.error);
    }

    this.props.items.add(item.value);

    return Result.Ok(null);
  }

  removeItem(props: { id: string }) {
    const item = this.props.items.find((item) => item.id.value === props.id);

    if (!item) {
      return Result.Ok(null);
    }

    this.props.items.remove(item);

    return Result.Ok(null);
  }

  clear() {
    this.props.items.clear();

    return Result.Ok(null);
  }

  static create(props: { userId: string }) {
    const id = CartId.from(props.userId);
    return Result.Ok(new Cart(id.value, { items: new CartItemCollection() }));
  }

  static from(props: { userId: string; cartItems: CartItemProps[] }) {
    const id = CartId.from(props.userId);
    const items = props.cartItems.map((item) => CartItem.from(item).value);
    const collection = new CartItemCollection(items);

    return Result.Ok(new Cart(id.value, { items: collection }));
  }
}
