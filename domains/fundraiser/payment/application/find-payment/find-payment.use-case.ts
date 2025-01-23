import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentDomain } from '../../infrastructure/payment.repository';
import { AbstractPaymentRepository } from '../../domain/interfaces/payment.repository';
import {
  PaymentDto,
  PaymentMapper,
} from '../../infrastructure/mapper/payment.mapper';

export type FindPaymentInput = { userId: string; paymentId: string };
export type FindPaymentOutput = Result<PaymentDto, HttpException>;

@Injectable()
export class FindPaymentUseCase
  implements Query<FindPaymentInput, FindPaymentOutput>
{
  constructor(
    @Inject(PaymentDomain.Repository)
    private readonly paymentRepository: AbstractPaymentRepository,
  ) {}
  async execute(input: FindPaymentInput) {
    const payment = await this.paymentRepository.findOneByUserIdAndPaymentId({
      userId: input.userId,
      paymentId: input.paymentId,
    });

    if (!payment) {
      return Result.Err(new NotFoundException('Payment not found'));
    }

    return Result.Ok(PaymentMapper.toDto(payment));
  }
}
