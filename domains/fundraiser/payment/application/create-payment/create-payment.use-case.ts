import { Command, Result } from '@common/ddd';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CreatePaymentProps,
  Payment,
} from '../../domain/payment.aggregate-root';
import { PaymentDomain } from '../../infrastructure/payment.repository';
import { AbstractPaymentRepository } from '../../domain/interfaces/payment.repository';

export type CreatePaymentInput = CreatePaymentProps;
export type CreatePaymentOutput = Result<{ id: string }, HttpException>;

@Injectable()
export class CreatePaymentUseCase
  implements Command<CreatePaymentInput, CreatePaymentOutput>
{
  constructor(
    @Inject(PaymentDomain.Repository)
    private readonly paymentRepository: AbstractPaymentRepository,
  ) {}
  async execute(input: CreatePaymentInput) {
    const payment = Payment.create(input);

    if (payment.isErr()) {
      return Result.Err(new BadRequestException(payment.error));
    }

    await this.paymentRepository.save(payment.value);

    return Result.Ok({ id: payment.value.id.value });
  }
}
