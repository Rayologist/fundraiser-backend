import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { NewebPayService } from './services/newebpay.service';
import { CartDomainModule } from '@domains/fundraiser/cart/cart.module';
import { OrderDomainModule } from '@domains/fundraiser/order/order.module';
import { PaymentDomainModule } from '@domains/fundraiser/payment/payment.module';
import { CheckoutService } from './services/checkout.service';
import { JWTService } from '../jwt/jwt.service';
import { NewebpayController } from './newebpay.controller';

@Module({
  imports: [CartDomainModule, OrderDomainModule, PaymentDomainModule],
  controllers: [PaymentController, NewebpayController],
  providers: [PaymentService, NewebPayService, CheckoutService, JWTService],
})
export class PaymentModule {}
