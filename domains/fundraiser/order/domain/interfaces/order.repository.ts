import { AbstractRepository } from '@common/ddd';
import { Order as OrderAggregateRoot } from '../order.aggregate-root';

export interface AbstractOrderRepository
  extends AbstractRepository<OrderAggregateRoot> {
  findOneByUserIdAndOrderId(input: {
    userId: string;
    orderId: string;
  }): Promise<OrderAggregateRoot | null>;
}
