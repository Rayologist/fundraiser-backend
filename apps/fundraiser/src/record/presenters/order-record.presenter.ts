import { Presenter } from '@common/ddd/presenter';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';
import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { Payment } from '@modules/postgres/entities/payment.entity';
import { Injectable } from '@nestjs/common';

type OrderRecordView = {
  id: string;
  createdAt: Date;
  status: PaymentStatus;
  amount: number;
};

@Injectable()
export class OrderRecordPresenter implements Presenter {
  present(
    order: Omit<Order, 'orderItems' | 'payments'> & {
      orderItems: OrderItem[];
      payments: Payment[];
    },
  ): OrderRecordView {
    const base = {
      id: order.id,
      createdAt: order.createdAt,
      amount: order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    } as const;

    let status: PaymentStatus | null = null;
    let hasFailedPayment = false;

    order.payments.forEach((payment) => {
      if (payment.status === PaymentStatus.PAID) {
        status = PaymentStatus.PAID;
        return;
      }

      if (payment.status === PaymentStatus.FAILED) {
        hasFailedPayment = true;
      }
    });

    if (status === PaymentStatus.PAID) {
      return {
        ...base,
        status: PaymentStatus.PAID,
      };
    }

    if (hasFailedPayment) {
      return {
        ...base,
        status: PaymentStatus.FAILED,
      };
    }

    return {
      ...base,
      status: PaymentStatus.PENDING,
    };
  }
}
