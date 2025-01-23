import { AggregateRoot, Result } from '@common/ddd';
import { PaymentId } from './value-objects/payment-id.value-object';
import { UserId } from '@domains/fundraiser/user/domain/value-objects/user-id.value-object';
import { OrderId } from '@domains/fundraiser/order/domain/value-objects/order-id.value-object';
import { PaymentSucceeded } from './events/payment-succeeded.event';

export const enum PaymentStatus {
  PENDING = 0,
  PAID = 1,
  FAILED = 2,
}

export type PaymentAggregateRootProps = {
  userId: UserId;
  orderId: OrderId;
  paymentMethod: string | null;
  transactionId: string | null;
  transactedAt: Date | null;
  status: PaymentStatus;
  providerResponse: Record<string, any> | null;
};

export type PaymentProps = {
  id: string;
  userId: string;
  orderId: string;
  paymentMethod: string | null;
  transactionId: string | null;
  transactedAt: Date | null;
  status: PaymentStatus;
  providerResponse: Record<string, any> | null;
};

export type CreatePaymentProps = Pick<PaymentProps, 'userId' | 'orderId'>;

export class Payment extends AggregateRoot<
  PaymentId,
  PaymentAggregateRootProps
> {
  get userId() {
    return this.props.userId;
  }

  get orderId() {
    return this.props.orderId;
  }

  get paymentMethod() {
    return this.props.paymentMethod;
  }

  get transactionId() {
    return this.props.transactionId;
  }

  get transactedAt() {
    return this.props.transactedAt;
  }

  get status() {
    return this.props.status;
  }

  get providerResponse() {
    return this.props.providerResponse;
  }

  paymentSucceeded() {
    this.addEvent(
      new PaymentSucceeded({
        orderId: this.props.orderId.value,
        paymentId: this.id.value,
      }),
    );
  }

  setPaid(props: {
    transactionId: string;
    transactedAt: Date;
    paymentMethod: string;
    providerResponse: Record<string, any>;
  }) {
    this.props.transactionId = props.transactionId;
    this.props.transactedAt = props.transactedAt;
    this.props.paymentMethod = props.paymentMethod;
    this.props.providerResponse = props.providerResponse;
    this.props.status = PaymentStatus.PAID;
    this.paymentSucceeded();
  }

  setFailed(props: {
    transactionId: string;
    transactedAt: Date;
    paymentMethod: string;
    providerResponse: Record<string, any>;
  }) {
    this.props.status = PaymentStatus.FAILED;
    this.props.transactionId = props.transactionId;
    this.props.transactedAt = props.transactedAt;
    this.props.paymentMethod = props.paymentMethod;
    this.props.providerResponse = props.providerResponse;
  }

  static create(props: CreatePaymentProps) {
    const id = PaymentId.create();
    const userId = UserId.from(props.userId);
    const orderId = OrderId.from(props.orderId);

    return Result.Ok(
      new Payment(id.value, {
        userId: userId.value,
        orderId: orderId.value,
        transactedAt: null,
        transactionId: null,
        paymentMethod: null,
        status: PaymentStatus.PENDING,
        providerResponse: null,
      }),
    );
  }

  static from(props: PaymentProps) {
    const id = PaymentId.from(props.id);
    const userId = UserId.from(props.userId);
    const orderId = OrderId.from(props.orderId);

    return Result.Ok(
      new Payment(id.value, {
        userId: userId.value,
        orderId: orderId.value,
        transactedAt: props.transactedAt,
        transactionId: props.transactionId,
        paymentMethod: props.paymentMethod,
        status: props.status,
        providerResponse: props.providerResponse,
      }),
    );
  }
}
