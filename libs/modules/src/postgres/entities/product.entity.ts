import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { DefaultEntity, UlidColumn } from '../common/columns';
import { Campaign } from './campaign.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order/order-item.entity';
import { Currency } from '@common/ddd/money';
import { DecimalColumnTransformer } from '../common/transformers/decimal.transformer';

@Entity('Product')
export class Product extends DefaultEntity {
  constructor(args?: Partial<Product>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'simple-json' })
  pictures!: string[];

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  goalAmount!: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  currentAmount!: number;

  @Column({ type: 'int', default: 0 })
  totalContributors!: number;

  @Column({ type: 'char', length: 5 })
  currency!: Currency;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean', default: false })
  deleted!: boolean;

  @UlidColumn()
  campaignId!: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.products)
  campaign?: Relation<Campaign>;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems?: Relation<CartItem[]>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: Relation<OrderItem[]>;
}
