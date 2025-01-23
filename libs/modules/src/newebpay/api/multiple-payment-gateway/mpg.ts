import { Version } from '../core/versions';
import * as qs from 'qs';
import { Crypto } from '../core/crypto';
import { TradeInfo } from './types/request';
import { ReturnMessage } from './types/response';

export type MPGInput = {
  hashKey: string;
  hashIV: string;
  isProduction: boolean;
};

class MPG {
  version = Version.MPG;
  URL: string;
  crypto: Crypto;

  constructor(private readonly input: MPGInput) {
    this.crypto = new Crypto(input.hashKey, input.hashIV);
    this.URL = input.isProduction
      ? 'https://core.newebpay.com/MPG/mpg_gateway'
      : 'https://ccore.newebpay.com/MPG/mpg_gateway';
  }

  private generateQueryString(encrypted: string) {
    return `HashKey=${this.input.hashKey}&${encrypted}&HashIV=${this.input.hashIV}`;
  }

  generatePostData(tradeInfo: TradeInfo) {
    const tradeInfoQuery = qs.stringify(tradeInfo);
    const TradeInfo = this.crypto.encrypt(tradeInfoQuery);
    const queryString = this.generateQueryString(TradeInfo);
    const TradeSha = this.crypto.hashSHA256(queryString);

    return {
      URL: this.URL,
      MerchantID: tradeInfo.MerchantID,
      TradeInfo: TradeInfo,
      TradeSha: TradeSha,
      Version: this.version,
    };
  }

  decrypt(returnMessage: ReturnMessage) {
    const { TradeInfo, TradeSha } = returnMessage;
    const queryString = this.generateQueryString(TradeInfo);
    const isValid = this.crypto.validateSHA(queryString, TradeSha);

    if (!isValid) {
      return false;
    }

    const decrypted = this.crypto.decrypt(TradeInfo);

    return decrypted;
  }
}

export default MPG;
