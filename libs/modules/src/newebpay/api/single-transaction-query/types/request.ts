import { ResponseType } from '../../core/types';

/**
 * Request parameters for querying a single transaction
 */
export interface STQRequest {
  /** NewebPay merchant ID. Length must be 15 characters */
  MerchantID: string;

  /** API version. Must be "1.3" for this endpoint */
  Version: '1.3';

  /** Response format. JSON or String */
  RespondType: ResponseType;

  /** SHA256 hash value generated according to the documentation */
  CheckValue: string;

  /** Unix timestamp in seconds */
  TimeStamp: number;

  /**
   * Merchant's order number
   * Max length: 30 characters
   * Can only contain letters, numbers and underscores
   */
  MerchantOrderNo: string;

  /** Transaction amount in TWD */
  Amt: number;

  /**
   * Optional gateway parameter
   * Use "Composite" for composite merchants (MS5 prefix)
   */
  Gateway?: string;
}
