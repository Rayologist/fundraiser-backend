import { TaxId } from '@common/crypto';
import { Presenter } from '@common/ddd/presenter';
import { CampaignDto } from '@domains/fundraiser/campaign/infrastructure/mappers/campaign.mapper';
import { DonorInfoDto } from '@domains/fundraiser/order/infrastructure/mappers/donor-info.mapper';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';
import { ProductDto } from '@domains/fundraiser/product/infrastructure/mappers/product.mapper';
import { paymentMethodType } from '@modules/newebpay';
import { DonorInfo } from '@modules/postgres/entities/donor-info.entity';
import { OrderItem } from '@modules/postgres/entities/order/order-item.entity';
import { Order } from '@modules/postgres/entities/order/order.entity';
import { Payment } from '@modules/postgres/entities/payment.entity';
import { Injectable } from '@nestjs/common';

type OrderDetails = Omit<Order, 'orderItems' | 'payments' | 'donorInfo'> & {
  orderItems: OrderItem[];
  payments: Payment[];
  donorInfo: DonorInfo;
};

type OrderDetailsView = {
  id: string;
  createdAt: Date;
  amount: number;
  payments: {
    id: string;
    transactionId: string | null;
    transactedAt: Date | null;
    status: PaymentStatus;
    method: string | null;
    createdAt: Date;
  }[];
  donorInfo: DonorInfoDto;
  orderItems: {
    id: string;
    price: number;
    product: {
      title: string;
      campaign: {
        title: string;
      };
    };
  }[];
};

@Injectable()
export class OrderDetailsPresenter implements Presenter {
  present(order: OrderDetails): OrderDetailsView {
    const amount = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const payments = order.payments.map((payment) => {
      return {
        id: payment.id,
        transactionId: payment.transactionId,
        transactedAt: payment.transactedAt,
        status: payment.status,
        method:
          paymentMethodType[payment.paymentMethod ?? ''] ??
          payment.paymentMethod,
        createdAt: payment.createdAt,
      };
    });

    const taxId = order.donorInfo.taxId
      ? TaxId.decrypt(order.donorInfo.taxId)
      : null;

    const donorInfo: DonorInfoDto = {
      fullName: order.donorInfo.fullName,
      email: order.donorInfo.email,
      isGILMember: order.donorInfo.isGILMember,
      phoneNumber: order.donorInfo.phoneNumber,
      receiptName: order.donorInfo.receiptName,
      receiptRequest: order.donorInfo.receiptRequest,
      taxId,
    };

    const orderItems = order.orderItems.flatMap((item) => {
      if (!item.product || !item.product.campaign) {
        return [];
      }

      const campaign: Pick<CampaignDto, 'title'> = {
        title: item.product.campaign.title,
      };

      const product: Pick<ProductDto, 'title'> = {
        title: item.product.title,
      };

      return {
        id: item.id,
        price: item.price,
        product: {
          ...product,
          campaign,
        },
      };
    });

    return {
      id: order.id,
      createdAt: order.createdAt,
      amount,
      payments,
      donorInfo,
      orderItems,
    };
  }
}
