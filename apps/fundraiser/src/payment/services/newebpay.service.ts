import { env } from '@common/environments/fundraiser.env';
import { NewebPay } from '@modules/newebpay';
import { LangType } from '@modules/newebpay/api/multiple-payment-gateway/types/request';
import { ReturnMessage } from '@modules/newebpay/api/multiple-payment-gateway/types/response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewebPayService {
  private readonly newebpay: NewebPay;
  constructor() {
    const merchant = {
      merchantID: env.newebpayMerchantId,
      hashKey: env.newebpayHashKey,
      hashIV: env.newebpayHashIV,
      isProduction: env.mode === 'production',
    };

    this.newebpay = new NewebPay(merchant);
  }

  async requestPayment(args: {
    orderId: string;
    userId: string;
    amount: number;
    itemDesc: string;
    email: string;
    orderComment?: string;
  }) {
    const postData = this.newebpay.generatePostData({
      MerchantOrderNo: args.orderId,
      Amt: args.amount,
      ItemDesc: args.itemDesc,
      Email: args.email,
      EmailModify: 0,
      OrderComment: args.orderComment,
      LangType: LangType.TRADITIONAL_CHINESE,
      ReturnURL: `${env.serverUrl}/v1/payment/newebpay/redirect`,
      NotifyURL: `${env.serverUrl}/v1/payment/newebpay/confirm`,
      ClientBackURL: `${env.serverUrl}/v1/payment/newebpay/redirect`,
    });

    return postData;
  }

  decrypt(returnMessage: ReturnMessage) {
    return this.newebpay.decrypt(returnMessage);
  }
}
