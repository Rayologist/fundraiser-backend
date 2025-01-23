import { BadRequestException, Injectable } from '@nestjs/common';
import { NewebPayService } from './services/newebpay.service';
import { DonorInfoDto } from './dtos/checkout.dto';
import { CheckoutService } from './services/checkout.service';
import { ReturnMessage } from '@modules/newebpay/api/multiple-payment-gateway/types/response';
import { NewebPayUpdatePaymentUseCase } from '@domains/fundraiser/payment/application/newebpay-update-payment/newebpay-update-payment.use-case';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';
import { PaymentRepository } from '@modules/postgres/repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly newebpayService: NewebPayService,
    private readonly newebpayUpdatePaymentUseCase: NewebPayUpdatePaymentUseCase,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  checkout(args: {
    userId: string;
    cartItemIds: string[];
    donorInfo: DonorInfoDto;
  }) {
    return this.checkoutService.checkout(args);
  }

  checkoutById(args: { userId: string; orderId: string }) {
    return this.checkoutService.checkoutByOrderId(args);
  }

  async redirect(returnMessage: ReturnMessage) {
    const decrypted = this.newebpayService.decrypt(returnMessage);
    if (!decrypted) {
      return '/records';
    }

    const payment = await this.paymentRepository.findOneById(
      decrypted.Result.MerchantOrderNo,
    );

    if (!payment) {
      return '/records';
    }

    return `/records/${payment.orderId}`;
  }

  async confirm(returnMessage: ReturnMessage) {
    const decrypted = this.newebpayService.decrypt(returnMessage);

    if (!decrypted) {
      throw new BadRequestException('Invalid data');
    }

    const result = decrypted.Result;

    let status = PaymentStatus.FAILED;

    if (returnMessage.Status === 'SUCCESS') {
      status = PaymentStatus.PAID;
    }

    let transactedAt = new Date();

    if (result.PayTime.length === 18) {
      const date = result.PayTime.slice(0, 10);
      const time = result.PayTime.slice(10);

      transactedAt = new Date(`${date} ${time}`);
    } else if (result.PayTime.length === 19) {
      transactedAt = new Date(result.PayTime);
    } else {
      console.error(`invalid PayTime ${result.PayTime}`);
    }

    const res = await this.newebpayUpdatePaymentUseCase.execute({
      paymentId: result.MerchantOrderNo,
      transactedAt,
      transactionId: result.TradeNo,
      paymentMethod: result.PaymentType,
      status,
      providerResponse: decrypted,
    });

    if (res.isErr()) {
      throw new BadRequestException(res.error);
    }
  }
}
