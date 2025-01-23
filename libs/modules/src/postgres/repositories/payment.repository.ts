import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly _paymentRepository: Repository<Payment>,
  ) {}

  async findOneById(id: string) {
    return this._paymentRepository.findOne({ where: { id } });
  }

  async getPaymentByUserId(userId: string) {
    return this._paymentRepository.find({
      where: {
        userId,
      },
    });
  }

  async getPaymentByOrderId(orderId: string) {
    return this._paymentRepository.findOne({
      where: {
        orderId,
      },
    });
  }

  async isOrderPaid(args: { orderId: string }) {
    const payments = await this._paymentRepository.find({
      where: {
        orderId: args.orderId,
      },
    });

    if (!payments.length) {
      return false;
    }

    return payments.some((p) => p.status === PaymentStatus.PAID);
  }
}
