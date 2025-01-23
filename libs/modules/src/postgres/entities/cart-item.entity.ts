import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { DefaultEntity, UlidColumn } from '../common/columns';
import { Product } from './product.entity';
import { User } from './user.entity';
import { DecimalColumnTransformer } from '../common/transformers/decimal.transformer';

@Entity('CartItem')
export class CartItem extends DefaultEntity {
  constructor(args?: Partial<CartItem>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'int' })
  quantity!: number;

  // price being here is because donation price is set by the user
  // and not by the product
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  price!: number;

  @UlidColumn()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product?: Relation<Product>;

  @UlidColumn()
  userId!: string;

  @ManyToOne(() => User, (user) => user.cartItems)
  user?: Relation<User>;
}
