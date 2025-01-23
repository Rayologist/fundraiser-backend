import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { DefaultEntity, UlidColumn } from '../common/columns';
import { User } from './user.entity';
import { Order } from './order/order.entity';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';

@Entity('Payment')
export class Payment extends DefaultEntity {
  constructor(args?: Partial<Payment>) {
    super();
    Object.assign(this, args);
  }

  @UlidColumn()
  userId!: string;

  @Column({ type: 'text' })
  orderId!: string;

  @Column({ type: 'text', nullable: true })
  transactionId!: string | null;

  @Column({ type: 'smallint', default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  paymentMethod!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  transactedAt!: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  providerResponse!: Record<string, any> | null;

  @ManyToOne(() => User, (user) => user.payment)
  user?: Relation<User>;

  @ManyToOne(() => Order, (order) => order.payments)
  order?: Relation<Order>;
}
