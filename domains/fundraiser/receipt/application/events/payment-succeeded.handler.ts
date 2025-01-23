import { DomainEventHandler } from '@common/ddd';
import { PaymentSucceeded } from '@domains/fundraiser/payment/domain/events/payment-succeeded.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateReceiptUseCase } from '../create-receipt/create-receipt.use-case';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';
import { ReceiptMailer } from '@common/mailer/mailers/receipt.mailer';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';
import { paymentMethodType } from '@modules/newebpay';
import { TaxId } from '@common/crypto';

@Injectable()
export class CreateReceiptOnPaymentSucceededHandler
  implements DomainEventHandler<PaymentSucceeded>
{
  constructor(
    private readonly createReceiptUseCase: CreateReceiptUseCase,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly receiptMailer: ReceiptMailer,
  ) {}
  @OnEvent(PaymentSucceeded.EventName, { async: true })
  async handle(event: PaymentSucceeded): Promise<void> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.payments', 'payments')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('product.campaign', 'campaign')
      .leftJoinAndSelect('order.donorInfo', 'donorInfo')
      .where('order.id = :id', { id: event.orderId })
      .getOne();

    if (!order || !order.donorInfo || !order.orderItems) {
      return;
    }

    if (order.donorInfo.receiptRequest === false) {
      return;
    }

    const receiptType = this.getReceiptType(order.orderItems);

    const result = await this.createReceiptUseCase.execute({
      userId: order.userId,
      orderId: event.orderId,
      donorInfoId: order.donorInfoId,
      description: receiptType,
      notes: null,
    });

    if (result.isErr()) {
      return;
    }

    const id = result.value.id;

    const paidPayment = order.payments?.find(
      (payment) => payment.status === PaymentStatus.PAID,
    );
    const amounts = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    if (!paidPayment) {
      return;
    }

    const taxId = order.donorInfo.taxId
      ? TaxId.decrypt(order.donorInfo.taxId)
      : '';

    await this.receiptMailer.send({
      to: order.donorInfo.email,
      receipt: {
        date: order.createdAt,
        userId: order.userId,
        donation: {
          amount: amounts,
          method: paidPayment.paymentMethod
            ? paymentMethodType[paidPayment.paymentMethod]
            : '',
          type: receiptType,
        },
        donor: {
          name: order.donorInfo.fullName,
          taxId: taxId ?? 'Error',
        },
        id,
        notes: '---',
      },
    });
  }

  private getReceiptType(orderItems: OrderItem[]) {
    const c = new Set();
    orderItems.forEach((item) => {
      const campaign = item.product?.campaign?.title || '未分類';
      c.add(campaign);
    });

    return Array.from(c).join('、');
  }
}
