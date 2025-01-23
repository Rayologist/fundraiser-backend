import { Injectable } from '@nestjs/common';
import { AbstractOrderRepository } from '../domain/interfaces/order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { Repository } from 'typeorm';
import { OrderMapper } from './mappers/order.mapper';
import { Order as OrderAggregateRoot } from '../domain/order.aggregate-root';
import { OrderItemMapper } from './mappers/order-item.mapper';
import { DonorInfoMapper } from './mappers/donor-info.mapper';
import { DonorInfo } from '@modules/postgres/entities/donor-info.entity';
import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';

export const enum OrderDomain {
  Repository = 'OrderDomainRepository',
}

@Injectable()
export class OrderDomainRepository implements AbstractOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(DonorInfo)
    private readonly donorInfoRepository: Repository<DonorInfo>,
  ) {}
  async findOneById(id: string) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('order.donorInfo', 'donorInfo')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      return null;
    }

    const { orderItems, donorInfo } = order;

    if (!orderItems || orderItems.length === 0) {
      return null;
    }

    if (!donorInfo) {
      return null;
    }

    return OrderMapper.toDomain({
      id: order.id,
      orderItems,
      userId: order.userId,
      donorInfo: donorInfo,
    });
  }

  async findOneByUserIdAndOrderId(input: { userId: string; orderId: string }) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('order.donorInfo', 'donorInfo')
      .where('order.id = :orderId', { orderId: input.orderId })
      .andWhere('order.userId = :userId', { userId: input.userId })
      .getOne();

    if (!order) {
      return null;
    }

    const { orderItems, donorInfo } = order;

    if (!orderItems || orderItems.length === 0) {
      return null;
    }

    if (!donorInfo) {
      return null;
    }

    return OrderMapper.toDomain({
      id: order.id,
      orderItems,
      userId: order.userId,
      donorInfo,
    });
  }

  async save(input: OrderAggregateRoot) {
    const data = OrderMapper.toPersistence(input);
    const orderItems = input.items.items.map((item) =>
      OrderItemMapper.toPersistence(item),
    );
    const donorInfo = DonorInfoMapper.toPersistence(input.donorInfo);
    await this.orderRepository.save(data);
    await this.orderItemRepository.save(orderItems);
    await this.donorInfoRepository.save(donorInfo);
  }
}
