import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderDto,
  OrderMapper,
} from '../../infrastructure/mappers/order.mapper';
import { OrderDomain } from '../../infrastructure/order.repository';
import { AbstractOrderRepository } from '../../domain/interfaces/order.repository';

export type FindOrderByIdInput = {
  userId: string;
  orderId: string;
};

export type FindOrderByIdOutput = Result<OrderDto, HttpException>;

@Injectable()
export class FindOrderByIdUseCase
  implements Query<FindOrderByIdInput, FindOrderByIdOutput>
{
  constructor(
    @Inject(OrderDomain.Repository)
    private readonly orderRepository: AbstractOrderRepository,
  ) {}

  async execute(input: FindOrderByIdInput) {
    const order = await this.orderRepository.findOneByUserIdAndOrderId({
      userId: input.userId,
      orderId: input.orderId,
    });

    if (!order) {
      return Result.Err(new NotFoundException('Order not found'));
    }

    return Result.Ok(OrderMapper.toDto(order));
  }
}
