import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { DefaultEntity } from '../common/columns';
import { Order } from './order/order.entity';
import { Receipt } from './receipt.entity';

@Entity('DonorInfo')
export class DonorInfo extends DefaultEntity {
  constructor(args?: Partial<DonorInfo>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'text' })
  fullName!: string;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'boolean' })
  isGILMember!: boolean;

  @Column({ type: 'boolean' })
  receiptRequest!: boolean;

  @Column({ type: 'text', nullable: true })
  receiptName!: string | null;

  @Column({ type: 'text', nullable: true })
  taxId!: string | null;

  @Column({ type: 'text', nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'text' })
  orderId!: string;

  @OneToOne(() => Order, (order) => order.donorInfo)
  @JoinColumn()
  order?: Relation<Order>;

  @OneToMany(() => Receipt, (receipt) => receipt.donorInfo)
  receipts?: Receipt[];
}
