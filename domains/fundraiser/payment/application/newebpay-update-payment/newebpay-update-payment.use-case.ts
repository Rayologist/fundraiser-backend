import { Command, Result } from '@common/ddd';
import {
  BadRequestException,
  HttpException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { AbstractPaymentRepository } from '../../domain/interfaces/payment.repository';
import { PaymentStatus } from '../../domain/payment.aggregate-root';
import { PaymentType } from '@modules/newebpay/api/core/types';
import { PaymentDomain } from '../../infrastructure/payment.repository';

export type NewebPayUpdatePaymentInput = {
  paymentId: string;
  transactedAt: Date;
  transactionId: string;
  paymentMethod: PaymentType;
  status: PaymentStatus;
  providerResponse: Record<string, any>;
};
export type NewebPayUpdatePaymentOutput = Result<null, HttpException>;

export class NewebPayUpdatePaymentUseCase
  implements Command<NewebPayUpdatePaymentInput, NewebPayUpdatePaymentOutput>
{
  constructor(
    @Inject(PaymentDomain.Repository)
    private readonly paymentRepository: AbstractPaymentRepository,
  ) {}

  async execute(input: NewebPayUpdatePaymentInput) {
    const payment = await this.paymentRepository.findOneById(input.paymentId);

    if (!payment) {
      return Result.Err(new NotFoundException('Payment not found'));
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return Result.Err(new BadRequestException('Payment is not pending'));
    }

    if (input.status === PaymentStatus.PAID) {
      payment.setPaid({
        transactionId: input.transactionId,
        transactedAt: input.transactedAt,
        paymentMethod: input.paymentMethod,
        providerResponse: input.providerResponse,
      });
    } else if (input.status === PaymentStatus.FAILED) {
      payment.setFailed({
        transactionId: input.transactionId,
        transactedAt: input.transactedAt,
        paymentMethod: input.paymentMethod,
        providerResponse: input.providerResponse,
      });
    }

    await this.paymentRepository.save(payment);

    return Result.Ok(null);
  }
}
