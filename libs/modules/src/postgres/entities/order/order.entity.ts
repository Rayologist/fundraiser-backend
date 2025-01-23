import { TimeEntity, UlidColumn } from '@modules/postgres/common/columns';
import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Payment } from '../payment.entity';
import { Receipt } from '../receipt.entity';
import { DonorInfo } from '../donor-info.entity';
import { User } from '../user.entity';

// copied from apple
// export const enum OrderStatus {
//   PLACED,
//   PROCESSING,
//   PREPARING_TO_SHIP,
//   SHIPPED,
//   DELIVERED,
//   // SHIPPING_TO_STORE,
//   // CHECK_IN_TODAY,
//   // READY_FOR_PICKUP,
//   // PICKED_UP,
// }

@Entity('Order')
export class Order extends TimeEntity {
  constructor(args?: Partial<Order>) {
    super();
    Object.assign(this, args);
  }

  @PrimaryColumn({ type: 'text' })
  id!: string;

  // @Column({ type: 'int' })
  // quantity!: number;

  // @Column({
  //   type: 'decimal',
  //   precision: 12,
  //   scale: 2,
  //   transformer: new DecimalColumnTransformer(),
  // })
  // amount!: number;

  // @Column({ type: 'varchar', length: 5 })
  // currency!: Currency;

  // @Column({ type: 'text' })
  // status!: OrderStatus;

  @UlidColumn()
  userId!: string;

  @UlidColumn()
  donorInfoId!: string;

  @ManyToOne(() => User, (user) => user.orders)
  user?: Relation<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems?: Relation<OrderItem>[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments?: Relation<Payment[]>;

  @OneToMany(() => Receipt, (receipt) => receipt.order)
  receipts?: Relation<Receipt[]>;

  @OneToOne(() => DonorInfo, (donorInfo) => donorInfo.order)
  donorInfo?: Relation<DonorInfo>;
}
