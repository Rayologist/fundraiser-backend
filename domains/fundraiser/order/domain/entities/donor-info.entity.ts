import { Entity, Result } from '@common/ddd';
import { DonorInfoId } from '../value-objects/donor-info-id.value-object';
import { Email } from '@common/ddd/value-objects/email.value-object';
import { OrderId } from '../value-objects/order-id.value-object';
import { TaxId } from '@common/crypto';

type ReceiptInfo = {
  name: string;
  taxId: string;
  phoneNumber: string | null;
};

type ReceiptInfoResolver =
  | {
      receiptRequest: true;
      receiptInfo: ReceiptInfo;
    }
  | {
      receiptRequest: false;
      receiptInfo: null;
    };

export type DonorInfoEntityProps = {
  orderId: OrderId;
  fullName: string;
  email: Email;
  isGILMember: boolean;
} & ReceiptInfoResolver;

export type DonorInfoProps = {
  id: string;
  orderId: string;
  fullName: string;
  email: string;
  isGILMember: boolean;
  receiptRequest: boolean;
  receiptName: string | null;
  taxId: string | null;
  phoneNumber: string | null;
};

export class DonorInfo extends Entity<DonorInfoId, DonorInfoEntityProps> {
  get orderId() {
    return this.props.orderId;
  }

  get fullName() {
    return this.props.fullName;
  }

  get email() {
    return this.props.email;
  }

  get isGILMember() {
    return this.props.isGILMember;
  }

  get receiptRequest() {
    return this.props.receiptRequest;
  }

  get receiptInfo() {
    return this.props.receiptInfo;
  }

  setTaxId(taxId: string) {
    if (this.props.receiptInfo) {
      this.props.receiptInfo.taxId = TaxId.encrypt(taxId);
      return Result.Ok(null);
    }

    return Result.Err('Receipt info is not available');
  }

  static create(props: Omit<DonorInfoProps, 'id'>) {
    const id = DonorInfoId.create();
    const email = Email.create(props.email);
    const orderId = OrderId.from(props.orderId);

    if (email.isErr()) {
      return Result.Err(email.error);
    }

    if (props.receiptRequest) {
      if (!props.receiptName || !props.taxId) {
        return Result.Err('Receipt name and tax ID are required');
      }

      return Result.Ok(
        new DonorInfo(id.value, {
          orderId: orderId.value,
          email: email.value,
          fullName: props.fullName,
          isGILMember: props.isGILMember,
          receiptRequest: true,
          receiptInfo: {
            name: props.receiptName,
            taxId: TaxId.encrypt(props.taxId),
            phoneNumber: props.phoneNumber,
          },
        }),
      );
    }

    return Result.Ok(
      new DonorInfo(id.value, {
        orderId: orderId.value,
        email: email.value,
        fullName: props.fullName,
        isGILMember: props.isGILMember,
        receiptRequest: false,
        receiptInfo: null,
      }),
    );
  }

  static from(props: DonorInfoProps) {
    const id = DonorInfoId.from(props.id);
    const email = Email.from(props.email);
    const orderId = OrderId.from(props.orderId);

    if (props.receiptRequest) {
      return Result.Ok(
        new DonorInfo(id.value, {
          orderId: orderId.value,
          email: email.value,
          fullName: props.fullName,
          isGILMember: props.isGILMember,
          receiptRequest: true,
          receiptInfo: {
            name: props.receiptName ?? '',
            taxId: props.taxId ?? '',
            phoneNumber: props.phoneNumber,
          },
        }),
      );
    }

    return Result.Ok(
      new DonorInfo(id.value, {
        orderId: orderId.value,
        email: email.value,
        fullName: props.fullName,
        isGILMember: props.isGILMember,
        receiptRequest: false,
        receiptInfo: null,
      }),
    );
  }
}
