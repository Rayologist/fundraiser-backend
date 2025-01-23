import { Order } from '@modules/postgres/entities/order/order.entity';
import { Payment } from '@modules/postgres/entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRecordPresenter } from './presenters/order-record.presenter';
import { OrderDetailsPresenter } from './presenters/order-details.presenter';
import { OrderRepository } from '@modules/postgres/repositories/order.repository';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly _rawOrderRepository: Repository<Order>,

    private readonly orderRepository: OrderRepository,

    private readonly orderRecordPresenter: OrderRecordPresenter,
    private readonly orderDetailsPresenter: OrderDetailsPresenter,
  ) {}
  // return this.orderRepository
  // .createQueryBuilder('order')
  // .leftJoinAndSelect('order.orderItems', 'orderItems')
  // .leftJoinAndSelect('orderItems.product', 'product')
  // .leftJoinAndSelect('product.campaign', 'campaign')
  // .leftJoinAndSelect('order.payments', 'payments')
  // .leftJoinAndSelect('order.donorInfo', 'donorInfo')
  // .where('order.id = :orderId', { orderId: args.orderId })
  // .andWhere('order.userId = :userId', { userId: args.userId })
  // .getOne();
  async findManyOrders(args: { userId: string }) {
    const orders = await this._rawOrderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.payments', 'payments')
      .where('order.userId = :userId', { userId: args.userId })
      .getMany();

    if (orders.length === 0) {
      return [];
    }

    return orders.flatMap((order) => {
      if (!order.payments || order.payments.length === 0) {
        return [];
      }

      if (!order.orderItems || order.orderItems.length === 0) {
        return [];
      }

      return this.orderRecordPresenter.present({
        ...order,
        payments: order.payments,
        orderItems: order.orderItems,
      });
    });
  }

  async findRecordByOrderId(args: { orderId: string; userId: string }) {
    const order = await this.orderRepository.findOrderById({
      orderId: args.orderId,
      userId: args.userId,
    });

    if (!order) {
      return null;
    }

    if (!order.payments || !order.donorInfo || !order.orderItems) {
      return null;
    }

    return this.orderDetailsPresenter.present({
      ...order,
      payments: order.payments,
      donorInfo: order.donorInfo,
      orderItems: order.orderItems,
    });
  }
}
