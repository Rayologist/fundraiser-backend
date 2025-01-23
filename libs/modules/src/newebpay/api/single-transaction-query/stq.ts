import * as qs from 'qs';
import fetch from 'node-fetch';
import { Crypto } from '../core/crypto';
import { Version } from '../core/versions';
import { STQRequest } from './types/request';
import { STQResponse, TransactionResult } from './types/response';

export class STQ {
  version = Version.STQ;
  crypto: Crypto;
  URL: string;

  constructor(
    private readonly input: {
      hashKey: string;
      hashIV: string;
      isProduction: boolean;
    },
  ) {
    this.crypto = new Crypto(input.hashKey, input.hashIV);
    this.URL = input.isProduction
      ? 'https://core.newebpay.com/API/QueryTradeInfo'
      : 'https://ccore.newebpay.com/API/QueryTradeInfo';
  }

  generateCheckValue(
    queryInfo: Pick<STQRequest, 'MerchantID' | 'MerchantOrderNo' | 'Amt'>,
  ) {
    const { Amt, MerchantID, MerchantOrderNo } = queryInfo;
    const queryString = qs.stringify({
      IV: this.input.hashIV,
      Amt,
      MerchantID,
      MerchantOrderNo,
      Key: this.input.hashKey,
    });

    return this.crypto.hashSHA256(queryString);
  }

  _validate(returnMessage: TransactionResult) {
    const { MerchantID, Amt, MerchantOrderNo, TradeNo, CheckCode } =
      returnMessage;
    const queryString = qs.stringify({
      HashIV: this.input.hashIV,
      Amt,
      MerchantID,
      MerchantOrderNo,
      TradeNo,
      HashKey: this.input.hashKey,
    });
    this.crypto.validateSHA(queryString, CheckCode);
  }

  async _query(queryInfo: STQRequest) {
    const UserAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';
    const response = await fetch(this.URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UserAgent,
      },
      body: qs.stringify(queryInfo),
    });

    return response.json();
  }

  async query(queryInfo: STQRequest) {
    const returnMessage: STQResponse = await this._query(queryInfo);

    if (Array.isArray(returnMessage.Result)) {
      return returnMessage;
    }

    this._validate(returnMessage.Result);

    return returnMessage;
  }
}
