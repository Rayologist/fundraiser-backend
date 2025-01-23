import { DomainEvent } from '@common/ddd';

export type PaymentSucceededProps = {
  paymentId: string;
  orderId: string;
};

export class PaymentSucceeded extends DomainEvent<PaymentSucceededProps> {
  static readonly EventName = 'fundraiser.payment.succeeded';

  constructor(props: PaymentSucceededProps) {
    super(PaymentSucceeded.EventName, props);
  }

  get paymentId() {
    return this.props.paymentId;
  }

  get orderId() {
    return this.props.orderId;
  }
}
