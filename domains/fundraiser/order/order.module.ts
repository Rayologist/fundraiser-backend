import { Module } from '@nestjs/common';
import { FindOrderByIdUseCase } from './application/find-order-by-id/find-order-by-id.use-case';
import { CreateOrderUseCase } from './application/create-order/create-order.use-case';
import {
  OrderDomain,
  OrderDomainRepository,
} from './infrastructure/order.repository';

const useCases = [FindOrderByIdUseCase, CreateOrderUseCase];

@Module({
  providers: [
    {
      provide: OrderDomain.Repository,
      useClass: OrderDomainRepository,
    },
    ...useCases,
  ],
  exports: [...useCases],
})
export class OrderDomainModule {}
