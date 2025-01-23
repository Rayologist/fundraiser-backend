import { CartItemRepository } from './cart-item.repository';
import { OrderRepository } from './order.repository';
import { PaymentRepository } from './payment.repository';
import { UserRepository } from './user.repository';

const repositories = [
  UserRepository,
  PaymentRepository,
  CartItemRepository,
  OrderRepository,
];

export { repositories };
