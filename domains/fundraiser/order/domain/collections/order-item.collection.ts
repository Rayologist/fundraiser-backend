import { Collection } from '@common/ddd';
import { OrderItem } from '../entities/order-item.entity';

export class OrderItemCollection extends Collection<OrderItem> {
  isSameItem(a: OrderItem, b: OrderItem): boolean {
    return a.equals(b);
  }
}
