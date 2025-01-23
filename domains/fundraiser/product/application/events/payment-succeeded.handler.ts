import { PaymentSucceeded } from '@domains/fundraiser/payment/domain/events/payment-succeeded.event';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { Product } from '@modules/postgres/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UpdateProductStatOnPaymentSucceededHandler {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly dataSource: DataSource,
  ) {}
  @OnEvent(PaymentSucceeded.EventName, { async: true })
  async handle(event: PaymentSucceeded) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.id = :id', { id: event.orderId })
      .getOne();

    if (!order) {
      return;
    }

    if (!order.orderItems) {
      return;
    }

    const productMap = new Map<string, { amount: number; count: number }>();

    order.orderItems.forEach((orderItem) => {
      const product = productMap.get(orderItem.productId);
      if (product) {
        product.amount += orderItem.price * orderItem.quantity;
        product.count += 1;
        productMap.set(orderItem.productId, product);
      } else {
        productMap.set(orderItem.productId, {
          amount: orderItem.price * orderItem.quantity,
          count: 1,
        });
      }
    });

    for (const [productId, { amount, count }] of productMap) {
      await this.updateProductContributors(productId, count, amount);
    }
  }

  private async updateProductContributors(
    productId: string,
    count: number,
    amount: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .setLock('pessimistic_write')
        .where('product.id = :id', { id: productId })
        .getOne();

      if (!product) {
        throw new Error('Product not found');
      }

      product.totalContributors += count;
      product.currentAmount += amount;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
