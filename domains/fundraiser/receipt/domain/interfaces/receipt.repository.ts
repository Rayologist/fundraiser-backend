import { AbstractRepository } from '@common/ddd';
import { Receipt } from '../receipt.aggregate-root';

export interface AbstractReceiptRepository
  extends AbstractRepository<Receipt> {}
