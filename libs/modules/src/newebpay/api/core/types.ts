/**
 * Response type enum
 */
export const enum ResponseType {
  JSON = 'JSON',
  STRING = 'String',
}

/** Available payment methods */
export const enum PaymentType {
  // Credit card payment
  CREDIT = 'CREDIT',

  // ATM bank transfer
  VACC = 'VACC',

  // Online banking transfer
  WEBATM = 'WEBATM',

  // Convenience store barcode payment
  BARCODE = 'BARCODE',

  // Convenience store code payment
  CVS = 'CVS',

  // LINE Pay payment
  LINEPAY = 'LINEPAY',

  // E.Sun Bank Wallet
  ESUNWALLET = 'ESUNWALLET',

  // Taiwan Pay
  TAIWANPAY = 'TAIWANPAY',

  // Convenience store pickup and payment
  CVSCOM = 'CVSCOM',

  // Fula installment payment
  FULA = 'FULA',
}

/**
 * Acquiring bank codes
 */
export const enum AuthBank {
  ESUN = 'Esun',
  TAISHIN = 'Taishin',
  CTBC = 'CTBC',
  NCCC = 'NCCC',
  CATHAY = 'CathayBK',
  CITI = 'Citibank',
  UBOT = 'UBOT',
  SKBANK = 'SKBank',
  FUBON = 'Fubon',
  FIRST = 'FirstBank',
  LINE = 'LINEBank',
}
