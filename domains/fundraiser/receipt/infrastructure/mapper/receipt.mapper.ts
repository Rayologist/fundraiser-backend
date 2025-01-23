import { Receipt } from '@modules/postgres/entities/receipt.entity';
import { Receipt as ReceiptAggregateRoot } from '../../domain/receipt.aggregate-root';

export interface ReceiptDto {}

export class ReceiptMapper {
  static toDto(receipt: ReceiptAggregateRoot): ReceiptDto {
    return {};
  }

  static toDomain(receipt: Receipt): ReceiptAggregateRoot {
    return ReceiptAggregateRoot.from({
      id: receipt.id,
      userId: receipt.userId,
      orderId: receipt.orderId,
      donorInfoId: receipt.donorInfoId,
      description: receipt.description,
      notes: receipt.notes,
    }).value;
  }

  static toPersistence(receipt: ReceiptAggregateRoot): Receipt {
    return new Receipt({
      id: receipt.id.value,
      userId: receipt.userId.value,
      orderId: receipt.orderId.value,
      donorInfoId: receipt.donorInfoId.value,
      description: receipt.description,
      notes: receipt.notes,
    });
  }
}
