import { AggregateRoot, Result } from '@common/ddd';
import { DonorInfoId } from '@domains/fundraiser/order/domain/value-objects/donor-info-id.value-object';
import { OrderId } from '@domains/fundraiser/order/domain/value-objects/order-id.value-object';
import { UserId } from '@domains/fundraiser/user/domain/value-objects/user-id.value-object';
import { ReceiptId } from './value-objects/receipt-id.value-object';

export type ReceiptAggregateRootProps = {
  userId: UserId;
  orderId: OrderId;
  donorInfoId: DonorInfoId;
  description: string;
  notes: string | null;
};

export type ReceiptProps = {
  id: string;
  userId: string;
  orderId: string;
  donorInfoId: string;
  description: string;
  notes: string | null;
};

export class Receipt extends AggregateRoot<
  ReceiptId,
  ReceiptAggregateRootProps
> {
  get userId(): UserId {
    return this.props.userId;
  }

  get orderId(): OrderId {
    return this.props.orderId;
  }

  get donorInfoId(): DonorInfoId {
    return this.props.donorInfoId;
  }

  get description(): string {
    return this.props.description;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  static create(props: Omit<ReceiptProps, 'id'>) {
    const id = ReceiptId.create();
    const userId = UserId.from(props.userId);
    const orderId = OrderId.from(props.orderId);
    const donorInfoId = DonorInfoId.from(props.donorInfoId);

    return Result.Ok(
      new Receipt(id.value, {
        userId: userId.value,
        orderId: orderId.value,
        donorInfoId: donorInfoId.value,
        description: props.description,
        notes: props.notes,
      }),
    );
  }

  static from(props: ReceiptProps) {
    const id = ReceiptId.from(props.id);
    const userId = UserId.from(props.userId);
    const orderId = OrderId.from(props.orderId);
    const donorInfoId = DonorInfoId.from(props.donorInfoId);

    return Result.Ok(
      new Receipt(id.value, {
        userId: userId.value,
        orderId: orderId.value,
        donorInfoId: donorInfoId.value,
        description: props.description,
        notes: props.notes,
      }),
    );
  }
}
