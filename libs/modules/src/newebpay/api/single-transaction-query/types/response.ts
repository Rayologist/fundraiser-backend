import { AuthBank, PaymentType } from '../../core/types';

/** Response structure for single transaction query */
export interface STQResponse {
  /** Status of the query. "SUCCESS" for successful queries, error code otherwise */
  Status: 'SUCCESS' | string;

  /** Human readable message describing the result */
  Message: string;

  /** Detailed transaction information */
  Result: TransactionResult;
}

/** Detailed transaction information returned by the query */
export interface TransactionResult {
  /** Merchant ID that initiated the transaction */
  MerchantID: string;

  /** Transaction amount in TWD */
  Amt: number;

  /** NewebPay's unique transaction number */
  TradeNo: string;

  /** Merchant's original order number */
  MerchantOrderNo: string;

  /** Current status of the transaction */
  TradeStatus: TradeStatus;

  /** Payment method used for the transaction */
  PaymentType: PaymentType;

  /** Transaction creation timestamp (Format: YYYY-MM-DD HH:mm:ss) */
  CreateTime: string;

  /** Payment completion timestamp (Format: YYYY-MM-DD HH:mm:ss) */
  PayTime: string;

  /** Expected settlement date */
  FundTime: string;

  /** Response verification code */
  CheckCode: string;

  /** Actual merchant ID for composite merchant transactions */
  ShopMerchantID?: string;

  // Credit Card Specific Fields
  /** Bank's response code for credit card transactions */
  RespondCode?: string;

  /** Authorization code for credit card transactions */
  Auth?: string;

  /** ECI value for 3D-Secure transactions */
  ECI?: string | null;

  /** Settlement amount */
  CloseAmt?: string | null;

  /** Current settlement status */
  CloseStatus?: CloseStatus;

  /** Amount available for refund */
  BackBalance?: string;

  /** Current refund status */
  BackStatus?: BackStatus;

  /** Bank's authorization result message */
  RespondMsg?: string;

  /** Installment period (if applicable) */
  Inst?: string;

  /** First installment amount */
  InstFirst?: string;

  /** Regular installment amount */
  InstEach?: string;

  /** Specific payment method details */
  PaymentMethod?: string;

  /** First 6 digits of the credit card */
  Card6No?: string;

  /** Last 4 digits of the credit card */
  Card4No?: string;

  /** Acquiring bank code */
  AuthBank?: AuthBank;

  // ATM/CVS Specific Fields
  /** Payment information (ATM account or CVS code) */
  PayInfo?: string;

  /** Payment deadline */
  ExpireDate?: string;

  /** Current order status */
  OrderStatus?: OrderStatus;

  // Store Pickup Fields
  /** Store type (e.g., [全家], [統一], [萊爾富], [OK mart]) */
  StoreType?: string;

  /** Store location code */
  StoreCode?: string;

  /** Store name */
  StoreName?: string;

  /** Logistics tracking number */
  LgsNo?: string;

  /** Logistics type (B2C or C2C) */
  LgsType?: 'B2C' | 'C2C';
}

/** Payment status codes */
export const enum TradeStatus {
  /** Payment not yet made */
  Unpaid = '0',
  /** Payment successfully completed */
  PaymentSuccess = '1',
  /** Payment failed */
  PaymentFailed = '2',
  /** Payment cancelled */
  Cancelled = '3',
  /** Payment refunded */
  Refunded = '6',
}

/** Settlement status codes */
export const enum CloseStatus {
  /** Not yet settled */
  Unsettled = '0',
  /** Waiting for settlement submission */
  WaitingForSettlement = '1',
  /** Settlement being processed */
  SettlementInProgress = '2',
  /** Settlement completed */
  SettlementCompleted = '3',
}

/** Refund status codes */
export const enum BackStatus {
  /** No refund initiated */
  NoRefund = '0',
  /** Refund waiting for submission */
  WaitingForRefund = '1',
  /** Refund being processed */
  RefundInProgress = '2',
  /** Refund completed */
  RefundCompleted = '3',
}

/** Order status codes */
export const enum OrderStatus {
  /** Payment not yet made */
  Unpaid = 0,
  /** Payment completed */
  Paid = 1,
  /** Order failed */
  Failed = 2,
  /** Order cancelled */
  Cancelled = 3,
  /** Order refunded */
  Refunded = 6,
  /** Payment being processed */
  PaymentPending = 9,
}
