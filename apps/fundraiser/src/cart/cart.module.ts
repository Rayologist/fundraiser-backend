import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartDomainModule } from '@domains/fundraiser/cart/cart.module';
import { ProductDomainModule } from '@domains/fundraiser/product/product.module';
import { JWTService } from '../jwt/jwt.service';
import { GetCartPresenter } from './presenters/cart.presenter';

@Module({
  imports: [CartDomainModule, ProductDomainModule],
  controllers: [CartController],
  providers: [CartService, JWTService, GetCartPresenter],
})
export class CartModule {}
