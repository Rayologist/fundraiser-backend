import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Order } from './order/order.entity';
import { Campaign } from './campaign.entity';
import { OrderItem } from './order/order-item.entity';
import { CartItem } from './cart-item.entity';
import { Payment } from './payment.entity';
import { Product } from './product.entity';
import { Receipt } from './receipt.entity';
import { User } from './user.entity';
import { DonorInfo } from './donor-info.entity';

const entities: EntityClassOrSchema[] = [
  Order,
  OrderItem,
  Campaign,
  CartItem,
  Payment,
  Product,
  Receipt,
  User,
  DonorInfo,
];

export { entities };
