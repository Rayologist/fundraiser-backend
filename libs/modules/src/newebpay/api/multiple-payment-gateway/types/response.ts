import { AuthBank, PaymentType } from '../../core/types';

/**
 * Payment status values
 */
export const enum PaymentStatus {
  SUCCESS = 'SUCCESS',
}

/**
 * Encryption types
 */
export const enum EncryptType {
  AES_GCM = 1,
  AES_CBC_PKCS7 = 0,
}

/**
 * Escrow bank codes
 */
export const enum EscrowBank {
  HNCB = 'HNCB', // 華南銀行
}

/**
 * Payment method types
 */
export const enum PaymentMethod {
  CREDIT = 'CREDIT',
  FOREIGN = 'FOREIGN',
  UNIONPAY = 'UNIONPAY',
  APPLEPAY = 'APPLEPAY',
  GOOGLEPAY = 'GOOGLEPAY',
  SAMSUNGPAY = 'SAMSUNGPAY',
  DCC = 'DCC',
}

/**
 * Token use status values
 */
export const enum TokenUseStatus {
  NOT_USING = 0,
  FIRST_TIME = 1,
  USING = 2,
  CANCELLED = 9,
}

/**
 * Store types for convenience store payments
 */
export const enum StoreType {
  SEVEN_ELEVEN = 1,
  FAMILY_MART = 2,
  OK_MART = 3,
  HI_LIFE = 4,
}

/**
 * Store names
 */
export const enum StoreName {
  SEVEN = 'SEVEN',
  FAMILY = 'FAMILY',
  OK = 'OK',
  HILIFE = 'HILIFE',
}

/**
 * Store type names in Chinese
 */
export const enum StoreTypeName {
  FAMILY_MART = '全家',
  SEVEN_ELEVEN = '7-ELEVEN',
  HI_LIFE = '萊爾富',
  OK_MART = 'OK mart',
}

/**
 * Logistics trade types
 */
export const enum LogisticsTradeType {
  PAYMENT_ON_PICKUP = 1,
  NO_PAYMENT = 3,
}

/**
 * Logistics types
 */
export const enum LogisticsType {
  B2C = 'B2C',
  C2C = 'C2C',
}

/**
 * Cross-border channel types
 */
export const enum CrossBorderChannel {
  ALIPAY = 'ALIPAY',
  WECHATPAY = 'WECHATPAY',
  ACCLINK = 'ACCLINK',
  CREDIT = 'CREDIT',
  CVS = 'CVS',
  P2GEACC = 'P2GEACC',
  VACC = 'VACC',
  WEBATM = 'WEBATM',
}

/**
 * Cryptocurrency types
 */
export const enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
}

/**
 * Base response parameters for payment completion
 */
export interface ReturnMessage {
  /**
   * Response status
   * - SUCCESS: Payment successful
   * - Otherwise: Error code
   */
  Status: PaymentStatus | string;

  /**
   * Merchant ID
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
   * API version
   */
  Version: string;

  /**
   * Encryption type
   */
  EncryptType?: EncryptType;
}

/**
 * Common fields returned for all payment methods
 */
export interface PaymentResultCommon {
  /**
   * Merchant ID
   */
  MerchantID: string;

  /**
   * Transaction amount in TWD
   */
  Amt: number;

  /**
   * NewebPay transaction number
   */
  TradeNo: string;

  /**
   * Merchant order number
   */
  MerchantOrderNo: string;

  /**
   * Payment type
   */
  PaymentType: PaymentType;

  /**
   * Response format (JSON)
   */
  RespondType: 'JSON';

  /**
   * Payment completion time
   * Format: YYYY-MM-DD HH:mm:ss
   */
  PayTime: string;

  /**
   * Customer's IP address
   */
  IP: string;

  /**
   * Escrow bank
   * Empty for direct gateway merchants
   */
  EscrowBank?: EscrowBank;
}

/**
 * Credit card specific response fields
 */
export interface CreditCardResponse {
  /**
   * Acquiring bank
   */
  AuthBank: AuthBank;

  /**
   * Bank response code
   */
  RespondCode: string;

  /**
   * Authorization code
   */
  Auth: string;

  /**
   * First 6 digits of credit card number
   */
  Card6No: string;

  /**
   * Last 4 digits of credit card number
   */
  Card4No: string;

  /**
   * Installment period
   */
  Inst: number;

  /**
   * First installment amount
   */
  InstFirst: number;

  /**
   * Each installment amount
   */
  InstEach: number;

  /**
   * ECI value for 3D transactions
   * 1,2,5,6 indicates 3D transaction
   */
  ECI?: string;

  /**
   * Credit card quick payment status
   */
  TokenUseStatus: TokenUseStatus;

  /**
   * Actual amount after bonus point deduction
   */
  RedAmt?: number;

  /**
   * Payment method type
   */
  PaymentMethod: PaymentMethod;

  /**
   * DCC foreign currency amount
   */
  DCC_Amt?: number;

  /**
   * DCC exchange rate
   */
  DCC_Rate?: number;

  /**
   * DCC risk exchange rate
   */
  DCC_Markup?: number;

  /**
   * DCC currency code (e.g., USD, JPY)
   */
  DCC_Currency?: string;

  /**
   * DCC currency numeric code
   */
  DCC_Currency_Code?: number;
}

/**
 * ATM/WebATM specific response fields
 */
export interface ATMResponse {
  /**
   * Payer's bank code
   */
  PayBankCode: string;

  /**
   * Last 5 digits of payer's account
   */
  PayerAccount5Code?: string;
}

/**
 * CVS (convenience store) code payment response fields
 */
export interface CVSResponse {
  /**
   * Payment code
   */
  CodeNo: string;

  /**
   * Store type
   */
  StoreType: StoreType;

  /**
   * Store ID
   */
  StoreID: string;
}

/**
 * Barcode payment response fields
 */
export interface BarcodeResponse {
  /**
   * First barcode segment
   */
  Barcode_1: string;

  /**
   * Second barcode segment
   */
  Barcode_2: string;

  /**
   * Third barcode segment
   */
  Barcode_3: string;

  /**
   * Payment count
   */
  RepayTimes: number;

  /**
   * Payment store code
   */
  PayStore: StoreName;
}

/**
 * Convenience store logistics response fields
 */
export interface CVSLogisticsResponse {
  /**
   * Store code
   */
  StoreCode: string;

  /**
   * Store name
   */
  StoreName: string;

  /**
   * Store type name
   */
  StoreType: StoreTypeName;

  /**
   * Store address
   */
  StoreAddr: string;

  /**
   * Transaction type
   */
  TradeType: LogisticsTradeType;

  /**
   * Recipient name
   */
  CVSCOMName: string;

  /**
   * Recipient phone
   */
  CVSCOMPhone: string;

  /**
   * Logistics shipping number
   */
  LgsNo: string;

  /**
   * Logistics type
   */
  LgsType: LogisticsType;
}

/**
 * Cross-border payment response fields
 */
export interface CrossBorderResponse {
  /**
   * Cross-border channel type
   */
  ChannelID: CrossBorderChannel;

  /**
   * Cross-border channel transaction number
   */
  ChannelNo: string;
}

/**
 * E-wallet response fields
 */
export interface EWalletResponse {
  /**
   * Actual payment amount
   */
  PayAmt: number;

  /**
   * Bonus deduction amount
   */
  RedDisAmt?: number;
}

/**
 * BitoPay specific response fields
 */
export interface BitoPayResponse extends EWalletResponse {
  /**
   * Cryptocurrency code
   */
  CryptoCurrency: CryptoCurrency;

  /**
   * Cryptocurrency amount
   */
  CryptoAmount: string;

  /**
   * Cryptocurrency exchange rate
   */
  CryptoRate: string;
}

/**
 * Complete payment response type combining all possible fields
 */
export type ReturnedTradeInfo = PaymentResultCommon &
  (
    | CreditCardResponse
    | ATMResponse
    | CVSResponse
    | BarcodeResponse
    | CVSLogisticsResponse
    | CrossBorderResponse
    | EWalletResponse
    | BitoPayResponse
  );
