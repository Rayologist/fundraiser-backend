export { NewebPay } from './api/newebpay';
export const paymentMethodType: Record<string, string> = {
  CREDIT: '信用卡付款',
  VACC: '銀行 ATM 轉帳',
  WEBATM: '網路銀行轉帳',
  BARCODE: '超商條碼繳費',
  CVS: '超商代碼繳費',
};

export function getPaymentMethodType(type: string) {
  return paymentMethodType[type] || '';
}
