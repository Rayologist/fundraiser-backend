import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';
import { OrderItem as OrderItemEntity } from '../../domain/entities/order-item.entity';
import { Currency } from '@common/ddd/money';

export type OrderItemDto = {
  id: string;
  productId: string;
  quantity: number;
  amount: number;
  currency: Currency;
};

export class OrderItemMapper {
  static toDto(orderItem: OrderItemEntity): OrderItemDto {
    return {
      id: orderItem.id.value,
      productId: orderItem.productId.value,
      quantity: orderItem.quantity.value,
      amount: orderItem.amount.value,
      currency: orderItem.amount.currency,
    };
  }

  static toDomain(orderItem: OrderItem): OrderItemEntity {
    return OrderItemEntity.from({
      id: orderItem.id,
      productId: orderItem.productId,
      orderId: orderItem.orderId,
      currency: orderItem.currency,
      quantity: orderItem.quantity,
      price: orderItem.price,
    }).value;
  }

  static toPersistence(input: OrderItemEntity): OrderItem {
    return new OrderItem({
      id: input.id.value,
      productId: input.productId.value,
      orderId: input.orderId.value,
      price: input.price.value,
      quantity: input.quantity.value,
      currency: input.amount.currency,
    });
  }
}
