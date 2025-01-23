import { AbstractRepository } from '@common/ddd';
import { Payment as PaymentAggregateRoot } from '../payment.aggregate-root';

export interface AbstractPaymentRepository
  extends AbstractRepository<PaymentAggregateRoot> {
  findOneByUserIdAndPaymentId(input: {
    userId: string;
    paymentId: string;
  }): Promise<PaymentAggregateRoot | null>;
  findOneByOrderId(input: {
    orderId: string;
  }): Promise<PaymentAggregateRoot | null>;
}
