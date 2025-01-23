import { Command, Result } from '@common/ddd';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateOrderProps, Order } from '../../domain/order.aggregate-root';
import { OrderDomain } from '../../infrastructure/order.repository';
import { AbstractOrderRepository } from '../../domain/interfaces/order.repository';

export type CreateOrderInput = CreateOrderProps;
export type CreateOrderOutput = Result<
  { id: string; amount: number },
  HttpException
>;

@Injectable()
export class CreateOrderUseCase
  implements Command<CreateOrderInput, CreateOrderOutput>
{
  constructor(
    @Inject(OrderDomain.Repository)
    private readonly orderRepository: AbstractOrderRepository,
  ) {}

  async execute(input: CreateOrderInput) {
    const orderOrError = Order.create(input);

    if (orderOrError.isErr()) {
      return Result.Err(new BadRequestException(orderOrError.error));
    }

    const order = orderOrError.value;

    await this.orderRepository.save(order);

    return Result.Ok({ id: order.id.value, amount: order.amount });
  }
}
