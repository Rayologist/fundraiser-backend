import { Column, Entity, OneToMany, OneToOne, Relation } from 'typeorm';
import { DefaultEntity } from '../common/columns';
import { Payment } from './payment.entity';
import { CartItem } from './cart-item.entity';
import { Receipt } from './receipt.entity';
import { Order } from './order/order.entity';

@Entity('User')
export class User extends DefaultEntity {
  constructor(args?: Partial<User>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'text' })
  firstName!: string;

  @Column({ type: 'text' })
  lastName!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text' })
  picture!: string;

  @Column({ type: 'text' })
  refreshToken!: string;

  @OneToMany(() => Payment, (payment) => payment.id)
  payment?: Relation<Payment[]>;

  @OneToMany(() => CartItem, (cartItem) => cartItem.id)
  cartItems?: Relation<CartItem[]>;

  @OneToMany(() => Receipt, (receipt) => receipt.user)
  receipts?: Relation<Receipt[]>;

  @OneToMany(() => Order, (order) => order.user)
  orders?: Relation<Order[]>;
}
