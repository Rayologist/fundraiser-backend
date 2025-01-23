import { ResponseType } from '../../core/types';

/**
 * Base request parameters for MPG transaction
 */
export interface MPGRequest {
  /**
   * Merchant ID
   * Length: 15 characters
   */
  MerchantID: string;

  /**
   * AES encrypted transaction data
   */
  TradeInfo: string;

  /**
   * SHA256 encrypted transaction data
   */
  TradeSha: string;

  /**
   * API Version - fixed at '2.0'
   */
  Version: '2.0';

  /**
   * Encryption mode
   * 1 = AES/GCM
   * 0 or undefined = AES/CBC/PKCS7Padding
   */
  EncryptType?: 0 | 1;
}

/**
 * Language type enum
 */
export const enum LangType {
  ENGLISH = 'en',
  TRADITIONAL_CHINESE = 'zh-tw',
  JAPANESE = 'jp',
}

/**
 * Bank type enum for WEBATM and ATM transfers
 */
export const enum BankType {
  BOT = 'BOT', // 台灣銀行
  HNCB = 'HNCB', // 華南銀行
}

/**
 * Logistics type enum
 */
export const enum LgsType {
  B2C = 'B2C', // 大宗寄倉(目前僅支援 7-ELEVEN)
  C2C = 'C2C', // 店到店(支援 7-ELEVEN、全家、萊爾富、OK mart)
}

/**
 * Token term demand type enum
 */
export const enum TokenTermDemand {
  REQUIRE_EXPIRY_AND_CCV = 1, // 必填信用卡到期日與安全碼
  REQUIRE_EXPIRY = 2, // 必填信用卡到期日
  REQUIRE_CCV = 3, // 必填安全碼
  NONE_REQUIRED = 4, // 信用卡到期日與安全碼皆非必填
}

/**
 * Payment content inside TradeInfo
 */
export interface TradeInfo {
  /**
   * Merchant ID
   */
  MerchantID: string;

  /**
   * Response format: JSON or String
   */
  RespondType: ResponseType;

  /**
   * Unix timestamp
   * Must be within 120 seconds of current time
   */
  TimeStamp: number;

  /**
   * API Version - fixed at '2.0'
   */
  Version: '2.0';

  /**
   * Display language
   * Defaults to Traditional Chinese if not specified
   */
  LangType?: LangType;

  /**
   * Merchant order number
   * Max length: 30 characters
   * Can only contain English, numbers and underscore
   * Must be unique within the same merchant
   */
  MerchantOrderNo: string;

  /**
   * Order amount in TWD
   * Numbers only, no decimals
   */
  Amt: number;

  /**
   * Item description
   * Max length: 50 characters
   * UTF-8 encoded
   * Avoid special characters
   */
  ItemDesc: string;

  /**
   * Transaction time limit in seconds
   * Min: 60 seconds, Max: 900 seconds
   * 0 or undefined = no limit
   */
  TradeLimit?: number;

  /**
   * Payment expiry date
   * Format: YYYYMMDD
   * Default: 7 days from now
   * Max: 180 days
   */
  ExpireDate?: string;

  /**
   * Payment expiry time for convenience store code payments
   * Format: His (235959)
   * Default: 235959
   */
  ExpireTime?: string;

  /**
   * Return URL after payment
   * Payment result will be posted to this URL
   * Only ports 80 and 443 allowed
   */
  ReturnURL?: string;

  /**
   * Notification URL
   * Payment result will be sent to this URL
   * Only ports 80 and 443 allowed
   */
  NotifyURL?: string;

  /**
   * Customer URL for non-real-time payments
   * Payment code/number will be sent to this URL
   * If empty, will show on NewebPay page
   */
  CustomerURL?: string;

  /**
   * Return button URL
   * URL for the return button on NewebPay pages
   */
  ClientBackURL?: string;

  /**
   * Customer email
   * For payment notifications
   */
  Email?: string;

  /**
   * Allow email modification
   * 1 = Can modify
   * 0 = Cannot modify
   * Default: Can modify
   */
  EmailModify?: 0 | 1;

  /**
   * Order comment
   * Max length: 300 characters
   * Will be shown on MPG page
   */
  OrderComment?: string;

  /**
   * Credit card one-time payment
   * 1 = Enable
   * 0 or undefined = Disable
   */
  CREDIT?: 0 | 1;

  /**
   * Apple Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  APPLEPAY?: 0 | 1;

  /**
   * Google Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  ANDROIDPAY?: 0 | 1;

  /**
   * Samsung Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  SAMSUNGPAY?: 0 | 1;

  /**
   * LINE Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  LINEPAY?: 0 | 1;

  /**
   * LINE Pay product image URL
   * Recommended size: 84x84 pixels
   * Only jpg/png supported
   */
  ImageUrl?: string;

  /**
   * Credit card installment settings
   * 1 = Enable all periods
   * 3,6,12,18,24,30 = Specific periods
   * Multiple periods separated by commas
   * 0 or empty = Disable
   */
  InstFlag?: string;

  /**
   * Credit card bonus point payment
   * 1 = Enable
   * 0 or undefined = Disable
   */
  CreditRed?: 0 | 1;

  /**
   * Union Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  UNIONPAY?: 0 | 1;

  /**
   * American Express
   * 1 = Enable
   * 0 or undefined = Disable
   */
  CREDITAE?: 0 | 1;

  /**
   * WebATM
   * 1 = Enable
   * 0 or undefined = Disable
   */
  WEBATM?: 0 | 1;

  /**
   * ATM Transfer
   * 1 = Enable
   * 0 or undefined = Disable
   */
  VACC?: 0 | 1;

  /**
   * Bank type for WEBATM and ATM transfers
   * Multiple banks separated by commas
   */
  BankType?: BankType | string;

  /**
   * Convenience store code payment
   * 1 = Enable
   * 0 or undefined = Disable
   */
  CVS?: 0 | 1;

  /**
   * Convenience store barcode payment
   * 1 = Enable
   * 0 or undefined = Disable
   */
  BARCODE?: 0 | 1;

  /**
   * E.Sun Wallet
   * 1 = Enable
   * 0 or undefined = Disable
   */
  ESUNWALLET?: 0 | 1;

  /**
   * Taiwan Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  TAIWANPAY?: 0 | 1;

  /**
   * BitoPay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  BITOPAY?: 0 | 1;

  /**
   * FULA installment settings
   * Same format as InstFlag
   */
  FULA?: string;

  /**
   * Convenience store logistics
   * 1 = Enable pickup without payment
   * 2 = Enable pickup with payment
   * 3 = Enable both
   * 0 or undefined = Disable
   */
  CVSCOM?: 0 | 1 | 2 | 3;

  /**
   * ezPay Wallet
   * 1 = Enable
   * 0 or undefined = Disable
   */
  EZPAY?: 0 | 1;

  /**
   * ezPay WeChat Pay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  EZPWECHAT?: 0 | 1;

  /**
   * ezPay Alipay
   * 1 = Enable
   * 0 or undefined = Disable
   */
  EZPALIPAY?: 0 | 1;

  /**
   * Logistics type
   */
  LgsType?: LgsType;

  /**
   * User binding data for credit card quick checkout
   * Can be member ID, email etc.
   * Only allows English, numbers, and ._@-
   */
  TokenTerm?: string;

  /**
   * Required fields for credit card quick checkout
   */
  TokenTermDemand?: TokenTermDemand;

  /**
   * National Travel Card transaction flag
   * 1 = National Travel Card transaction
   * 0 or undefined = Not National Travel Card transaction
   */
  NTCB?: 0 | 1;

  /**
   * Travel area code
   * 3 digits, see documentation for codes
   */
  NTCBLocate?: string;

  /**
   * Travel start date
   * Format: YYYY-MM-DD
   */
  NTCBStartDate?: string;

  /**
   * Travel end date
   * Format: YYYY-MM-DD
   */
  NTCBEndDate?: string;
}
