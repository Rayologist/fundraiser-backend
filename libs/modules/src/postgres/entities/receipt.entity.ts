import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { DefaultEntity, UlidColumn } from '../common/columns';
import { Order } from './order/order.entity';
import { User } from './user.entity';
import { DonorInfo } from './donor-info.entity';

@Entity('Receipt')
export class Receipt extends DefaultEntity {
  constructor(args?: Partial<Receipt>) {
    super();
    Object.assign(this, args);
  }

  @UlidColumn()
  userId!: string;

  @Column({ type: 'text' })
  orderId!: string;

  @Column({ type: 'text' })
  description!: string;

  @UlidColumn()
  donorInfoId!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @ManyToOne(() => Order, (order) => order.receipts)
  order?: Relation<Order>;

  @ManyToOne(() => DonorInfo, (donorInfo) => donorInfo.receipts)
  donorInfo?: Relation<DonorInfo>;

  @ManyToOne(() => User, (user) => user.receipts)
  user?: Relation<User>;
}
