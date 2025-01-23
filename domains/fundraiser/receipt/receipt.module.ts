import { Module } from '@nestjs/common';
import { CreateReceiptUseCase } from './application/create-receipt/create-receipt.use-case';
import {
  ReceiptDomain,
  ReceiptDomainRepository,
} from './infrastructure/receipt.repository';
import { CreateReceiptOnPaymentSucceededHandler } from './application/events/payment-succeeded.handler';
import { ReceiptModule } from '@modules/receipt/receipt.module';
import { MailerModule } from '@common/mailer/mailer.module';

const useCases = [CreateReceiptUseCase];

@Module({
  imports: [ReceiptModule, MailerModule],
  providers: [
    {
      provide: ReceiptDomain.Repository,
      useClass: ReceiptDomainRepository,
    },
    CreateReceiptOnPaymentSucceededHandler,
    ...useCases,
  ],
  exports: [...useCases],
})
export class ReceiptDomainModule {}
