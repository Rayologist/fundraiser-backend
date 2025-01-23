import * as qs from 'qs';
import MPG from './multiple-payment-gateway/mpg';
import { Version } from './core/versions';

import { TradeInfo } from './multiple-payment-gateway/types/request';
import {
  ReturnedTradeInfo,
  ReturnMessage,
} from './multiple-payment-gateway/types/response';
import { ResponseType } from './core/types';
import { STQ } from './single-transaction-query/stq';
import { STQRequest } from './single-transaction-query/types/request';

export class NewebPay {
  mpg: MPG;
  stq: STQ;
  constructor(
    private merchant: {
      hashKey: string;
      hashIV: string;
      merchantID: string;
      isProduction: boolean;
    },
  ) {
    const { hashKey, hashIV, isProduction, merchantID } = merchant;
    this.mpg = new MPG({ hashKey, hashIV, isProduction });
    this.stq = new STQ({ hashKey, hashIV, isProduction });
  }

  generatePostData(
    tradeInfo: Omit<
      TradeInfo,
      'MerchantID' | 'RespondType' | 'TimeStamp' | 'Version'
    > & { RespondType?: ResponseType },
  ) {
    return this.mpg.generatePostData({
      MerchantID: this.merchant.merchantID,
      RespondType: ResponseType.JSON,
      TimeStamp: Date.now(),
      Version: Version.MPG,
      ...tradeInfo,
    });
  }

  decrypt(
    returnMessage: ReturnMessage,
    parseQueryString = false,
  ):
    | {
        Status: string;
        Message: string;
        Result: ReturnedTradeInfo;
      }
    | false {
    const decryptedMessage = this.mpg.decrypt(returnMessage);

    if (!decryptedMessage) {
      return false;
    }

    if (parseQueryString) {
      return qs.parse(decryptedMessage) as unknown as any;
    }

    return JSON.parse(decryptedMessage);
  }

  queryTradeInfo(
    queryInfo: Omit<
      STQRequest,
      'MerchantID' | 'Version' | 'RespondType' | 'TimeStamp' | 'CheckValue'
    > & { RespondType?: ResponseType },
  ) {
    const { Amt: rawAmt, ...rest } = queryInfo;

    const Amt = typeof rawAmt === 'number' ? rawAmt : parseInt(rawAmt, 10);

    const CheckValue = this.stq.generateCheckValue({
      MerchantID: this.merchant.merchantID,
      Amt,
      MerchantOrderNo: rest.MerchantOrderNo,
    });

    return this.stq.query({
      MerchantID: this.merchant.merchantID,
      Version: Version.STQ,
      RespondType: ResponseType.JSON,
      TimeStamp: Date.now(),
      Amt,
      CheckValue,
      ...rest,
    });
  }
}
