import { DefaultEntity, UlidColumn } from '@modules/postgres/common/columns';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Product } from '../product.entity';
import { Order } from './order.entity';
import { Currency } from '@common/ddd/money';
import { DecimalColumnTransformer } from '@modules/postgres/common/transformers/decimal.transformer';

@Entity('OrderItem')
export class OrderItem extends DefaultEntity {
  constructor(args?: Partial<OrderItem>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'int' })
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  price!: number;

  @Column({ type: 'varchar', length: 5 })
  currency!: Currency;

  @UlidColumn()
  productId!: string;

  @Column({ type: 'text' })
  orderId!: string;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product?: Relation<Product>;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order?: Relation<Order>;
}
