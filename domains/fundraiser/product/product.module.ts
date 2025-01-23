import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/create-product/create-product.use-case';
import { FindOneProductUseCase } from './application/find-one-product/find-one-product.use-case';
import {
  ProductDomain,
  ProductDomainRepository,
} from './infrastructure/product.repository';
import { FindAllProductUseCase } from './application/find-all-products/find-all-products.use-case';
import { FindManyProductUseCase } from './application/find-many-product/find-many-product.use-case';
import { UpdateProductStatOnPaymentSucceededHandler } from './application/events/payment-succeeded.handler';

const useCases = [
  CreateProductUseCase,
  FindAllProductUseCase,
  FindOneProductUseCase,
  FindManyProductUseCase,
];

@Module({
  providers: [
    {
      provide: ProductDomain.Repository,
      useClass: ProductDomainRepository,
    },
    UpdateProductStatOnPaymentSucceededHandler,
    ...useCases,
  ],
  exports: [...useCases],
})
export class ProductDomainModule {}
