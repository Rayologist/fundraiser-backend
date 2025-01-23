import { Module } from '@nestjs/common';
import { AddCartItemUseCase } from './application/add-cart-item/add-cart-item.use-case';
import { ClearCartUseCase } from './application/clear-cart/clear-cart.use-case';
import { RemoveCartItemUseCase } from './application/remove-cart-item/remove-cart-item.use-case';
import { UpdateCartItemUseCase } from './application/update-cart-item-quantity/update-cart-item-quantity.use-case';
import {
  CartDomain,
  CartDomainRepository,
} from './infrastructure/cart.repository';
import { FindCartUseCase } from './application/find-cart/find-cart.use-case';

const useCases = [
  AddCartItemUseCase,
  FindCartUseCase,
  ClearCartUseCase,
  RemoveCartItemUseCase,
  UpdateCartItemUseCase,
];

@Module({
  providers: [
    {
      provide: CartDomain.Repository,
      useClass: CartDomainRepository,
    },
    ...useCases,
  ],
  exports: [...useCases],
})
export class CartDomainModule {}
