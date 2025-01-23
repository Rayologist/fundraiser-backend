import { AggregateRoot, Result } from '@common/ddd';
import { OrderId } from './value-objects/order-id.value-object';
import { OrderItemCollection } from './collections/order-item.collection';
import { OrderItem, OrderItemProps } from './entities/order-item.entity';
import { DonorInfo, DonorInfoProps } from './entities/donor-info.entity';
import { UserId } from '@domains/fundraiser/user/domain/value-objects/user-id.value-object';

export type OrderAggregateRootProps = {
  orderItems: OrderItemCollection;
  donorInfo: DonorInfo;
  userId: UserId;
};

export type OrderProps = {
  id: string;
  userId: string;
  orderItems: OrderItemProps[];
  donorInfo: DonorInfoProps;
};

export type CreateOrderProps = {
  userId: string;
  orderItems: Omit<OrderItemProps, 'id' | 'orderId'>[];
  donorInfo: Omit<DonorInfoProps, 'id' | 'orderId'>;
};

export class Order extends AggregateRoot<OrderId, OrderAggregateRootProps> {
  get donorInfo() {
    return this.props.donorInfo;
  }

  get userId() {
    return this.props.userId;
  }

  get items() {
    return this.props.orderItems;
  }

  get quantity() {
    return this.props.orderItems.items.reduce(
      (acc, item) => acc + item.quantity.value,
      0,
    );
  }

  get amount() {
    return this.props.orderItems.items.reduce(
      (acc, item) => acc + item.amount.value,
      0,
    );
  }

  get currency() {
    return this.props.orderItems.items[0].amount.currency;
  }

  addItem(orderItem: OrderItemProps) {
    const orderItemOrError = OrderItem.create(orderItem);

    if (orderItemOrError.isErr()) {
      return Result.Err(orderItemOrError.error);
    }

    this.props.orderItems.add(orderItemOrError.value);

    return Result.Ok(null);
  }

  static create(props: CreateOrderProps) {
    const idOrError = OrderId.create();
    const userId = UserId.from(props.userId);

    if (idOrError.isErr()) {
      return Result.Err(idOrError.error);
    }

    const id = idOrError.value;

    const collection = new OrderItemCollection();

    for (let i = 0; i < props.orderItems.length; i++) {
      const orderItemOrError = OrderItem.create({
        ...props.orderItems[i],
        orderId: id.value,
      });

      if (orderItemOrError.isErr()) {
        return Result.Err(orderItemOrError.error);
      }

      collection.add(orderItemOrError.value);
    }

    if (collection.items.length === 0) {
      return Result.Err('Order must have at least one item');
    }

    const donorInfoOrError = DonorInfo.create({
      ...props.donorInfo,
      orderId: id.value,
    });

    if (donorInfoOrError.isErr()) {
      return Result.Err(donorInfoOrError.error);
    }

    return Result.Ok(
      new Order(id, {
        userId: userId.value,
        orderItems: collection,
        donorInfo: donorInfoOrError.value,
      }),
    );
  }

  static from(props: OrderProps) {
    const id = OrderId.from(props.id);
    const donorInfo = DonorInfo.from(props.donorInfo);
    const userId = UserId.from(props.userId);

    const items = props.orderItems.map((item) => OrderItem.from(item).value);
    const collection = new OrderItemCollection(items);

    return Result.Ok(
      new Order(id.value, {
        userId: userId.value,
        orderItems: collection,
        donorInfo: donorInfo.value,
      }),
    );
  }
}
