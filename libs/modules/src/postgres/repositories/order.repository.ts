import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findOrderById(args: { orderId: string; userId: string }) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('product.campaign', 'campaign')
      .leftJoinAndSelect('order.payments', 'payments')
      .leftJoinAndSelect('order.donorInfo', 'donorInfo')
      .where('order.id = :orderId', { orderId: args.orderId })
      .andWhere('order.userId = :userId', { userId: args.userId })
      .getOne();
  }
}
