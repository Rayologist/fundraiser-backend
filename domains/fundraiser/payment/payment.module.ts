import { Module } from '@nestjs/common';
import { CreatePaymentUseCase } from './application/create-payment/create-payment.use-case';
import { FindPaymentUseCase } from './application/find-payment/find-payment.use-case';
import {
  PaymentDomain,
  PaymentDomainRepository,
} from './infrastructure/payment.repository';
import { NewebPayUpdatePaymentUseCase } from './application/newebpay-update-payment/newebpay-update-payment.use-case';

const useCases = [
  CreatePaymentUseCase,
  FindPaymentUseCase,
  NewebPayUpdatePaymentUseCase,
];

@Module({
  providers: [
    {
      provide: PaymentDomain.Repository,
      useClass: PaymentDomainRepository,
    },
    ...useCases,
  ],
  exports: [...useCases],
})
export class PaymentDomainModule {}
