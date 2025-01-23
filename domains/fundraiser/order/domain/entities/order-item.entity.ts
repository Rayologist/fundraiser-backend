import { Entity, Result } from '@common/ddd';
import { ProductId } from '@domains/fundraiser/product/domain/value-objects/product-id.value-object';
import { OrderItemId } from '../value-objects/order-item-id.value-object';
import { Currency, Money } from '@common/ddd/money';
import { Quantity } from '@common/ddd/quantity';
import { OrderId } from '../value-objects/order-id.value-object';

export type OrderItemEntityProps = {
  productId: ProductId;
  orderId: OrderId;
  quantity: Quantity;
  price: Money;
  amount: Money;
};

export type OrderItemProps = {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  currency: Currency;
};

export class OrderItem extends Entity<OrderItemId, OrderItemEntityProps> {
  get productId() {
    return this.props.productId;
  }

  get orderId() {
    return this.props.orderId;
  }

  get quantity() {
    return this.props.quantity;
  }

  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  static create(props: Omit<OrderItemProps, 'id'>) {
    const idOrError = OrderItemId.create();
    const quantityOrError = Quantity.create(props.quantity);
    const priceOrError = Money.create({
      value: props.price,
      currency: props.currency,
    });
    const amountOrError = Money.create({
      value: props.price * props.quantity,
      currency: props.currency,
    });

    const results = Result.all([
      idOrError,
      quantityOrError,
      priceOrError,
      amountOrError,
    ]);

    if (results.isErr()) {
      return Result.Err(results.error);
    }

    const [id, quantity, price, amount] = results.value;

    return Result.Ok(
      new OrderItem(id, {
        productId: ProductId.from(props.productId).value,
        orderId: OrderId.from(props.orderId).value,
        quantity,
        price,
        amount,
      }),
    );
  }

  static from(props: OrderItemProps) {
    const id = OrderItemId.from(props.id);
    const productId = ProductId.from(props.productId);
    const quantity = Quantity.from(props.quantity);
    const price = Money.from({
      value: props.price,
      currency: props.currency,
    });

    const amount = Money.from({
      value: props.price * props.quantity,
      currency: props.currency,
    });

    return Result.Ok(
      new OrderItem(id.value, {
        productId: productId.value,
        orderId: OrderId.from(props.orderId).value,
        quantity: quantity.value,
        price: price.value,
        amount: amount.value,
      }),
    );
  }
}
