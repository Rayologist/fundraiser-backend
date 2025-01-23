import {
  Payment as PaymentAggregateRoot,
  PaymentStatus,
} from '../../domain/payment.aggregate-root';
import { Payment } from '@modules/postgres/entities/payment.entity';

export interface PaymentDto {
  id: string;
  orderId: string;
  paymentMethod: string | null;
  transactionId: string | null;
  transactedAt: Date | null;
  status: PaymentStatus;
}

export class PaymentMapper {
  static toDto(input: PaymentAggregateRoot): PaymentDto {
    return {
      id: input.id.value,
      orderId: input.orderId.value,
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      status: input.status,
      transactedAt: input.transactedAt,
    };
  }

  static toDomain(input: Payment): PaymentAggregateRoot {
    return PaymentAggregateRoot.from({
      id: input.id,
      userId: input.userId,
      orderId: input.orderId,
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      transactedAt: input.transactedAt,
      status: input.status,
      providerResponse: input.providerResponse,
    }).value;
  }

  static toPersistence(input: PaymentAggregateRoot): Payment {
    return new Payment({
      id: input.id.value,
      userId: input.userId.value,
      orderId: input.orderId.value,
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      transactedAt: input.transactedAt,
      status: input.status,
      providerResponse: input.providerResponse,
    });
  }
}
