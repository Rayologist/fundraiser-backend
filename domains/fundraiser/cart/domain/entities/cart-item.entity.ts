import { Entity, Result } from '@common/ddd';
import { CartItemId } from '../value-objects/cart-item-id.value-object';
import { ProductId } from '../../../product/domain/value-objects/product-id.value-object';
import { Quantity } from '@common/ddd/quantity';
import { UserId } from '@domains/fundraiser/user/domain/value-objects/user-id.value-object';
import { Currency, Money } from '@common/ddd/money';

export type CartItemEntityProps = {
  quantity: Quantity;
  price: Money;
  userId: UserId;
  productId: ProductId;
};

export type CartItemProps = {
  id: string;
  quantity: number;
  price: number;
  currency: Currency;
  userId: string;
  productId: string;
};

export class CartItem extends Entity<CartItemId, CartItemEntityProps> {
  get userId() {
    return this.props.userId;
  }

  get price() {
    return this.props.price;
  }

  get quantity() {
    return this.props.quantity;
  }

  get productId() {
    return this.props.productId;
  }

  changeQuantity(value: number) {
    const quantity = Quantity.create(value);

    if (quantity.isErr()) {
      return Result.Err(quantity.error);
    }

    this.props.quantity = quantity.value;

    return Result.Ok(null);
  }

  changePrice(value: number) {
    const price = Money.create({
      currency: this.props.price.currency,
      value,
    });

    if (price.isErr()) {
      return Result.Err(price.error);
    }

    this.props.price = price.value;

    return Result.Ok(null);
  }

  static create(props: Omit<CartItemProps, 'id'>) {
    const cartItemId = CartItemId.create();
    const userId = UserId.from(props.userId);
    const productId = ProductId.from(props.productId);

    const priceOrError = Money.create({
      currency: props.currency,
      value: props.price,
    });

    const quantityOrError = Quantity.create(props.quantity);

    const results = Result.all([quantityOrError, priceOrError]);

    if (results.isErr()) {
      return Result.Err(results.error);
    }

    const [quantity, price] = results.value;

    return Result.Ok(
      new CartItem(cartItemId.value, {
        userId: userId.value,
        price,
        productId: productId.value,
        quantity,
      }),
    );
  }

  static from(props: CartItemProps) {
    const cartItemId = CartItemId.from(props.id);
    const quantity = Quantity.from(props.quantity);
    const price = Money.from({
      currency: props.currency,
      value: props.price,
    });

    const cartItem = new CartItem(cartItemId.value, {
      userId: UserId.from(props.userId).value,
      productId: ProductId.from(props.productId).value,
      quantity: quantity.value,
      price: price.value,
    });

    return Result.Ok(cartItem);
  }
}
