import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';
import { Order as OrderAggregateRoot } from '../../domain/order.aggregate-root';
import { OrderItemDto, OrderItemMapper } from './order-item.mapper';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { DonorInfoDto, DonorInfoMapper } from './donor-info.mapper';
import { DonorInfo } from '@modules/postgres/entities/donor-info.entity';

export interface OrderDto {
  id: string;
  amount: number;
  quantity: number;
  currency: string;
  orderItems: OrderItemDto[];
  donorInfo: DonorInfoDto;
}

export class OrderMapper {
  static toDto(order: OrderAggregateRoot): OrderDto {
    return {
      id: order.id.value,
      amount: order.amount,
      quantity: order.quantity,
      currency: order.currency,
      donorInfo: DonorInfoMapper.toDto(order.donorInfo),
      orderItems: order.items.items.map((item) => OrderItemMapper.toDto(item)),
    };
  }

  static toDomain(input: {
    id: Order['id'];
    userId: string;
    orderItems: OrderItem[];
    donorInfo: DonorInfo;
  }): OrderAggregateRoot {
    return OrderAggregateRoot.from({
      id: input.id,
      userId: input.userId,
      orderItems: input.orderItems,
      donorInfo: input.donorInfo,
    }).value;
  }

  static toPersistence(order: OrderAggregateRoot): Order {
    return new Order({
      id: order.id.value,
      userId: order.userId.value,
      donorInfoId: order.donorInfo.id.value,
    });
  }
}
