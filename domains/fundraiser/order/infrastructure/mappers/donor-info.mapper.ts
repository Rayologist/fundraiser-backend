import { DonorInfo } from '@modules/postgres/entities/donor-info.entity';
import { DonorInfo as DonorInfoEntity } from '../../domain/entities/donor-info.entity';
import { TaxId } from '@common/crypto';

export type DonorInfoDto = {
  fullName: string;
  email: string;
  isGILMember: boolean;
  receiptRequest: boolean;
  receiptName: string | null;
  taxId: string | null;
  phoneNumber: string | null;
};

export class DonorInfoMapper {
  static toDto(donorInfo: DonorInfoEntity): DonorInfoDto {
    const info = {
      fullName: donorInfo.fullName,
      email: donorInfo.email.value,
      isGILMember: donorInfo.isGILMember,
      receiptRequest: donorInfo.receiptRequest,
    };

    if (donorInfo.receiptRequest) {
      const taxId = donorInfo.receiptInfo?.taxId
        ? TaxId.decrypt(donorInfo.receiptInfo?.taxId)
        : null;
      return {
        ...info,
        receiptName: donorInfo.receiptInfo?.name ?? '',
        taxId,
        phoneNumber: donorInfo.receiptInfo?.phoneNumber ?? '',
      };
    }

    return {
      fullName: donorInfo.fullName,
      email: donorInfo.email.value,
      isGILMember: donorInfo.isGILMember,
      receiptRequest: donorInfo.receiptRequest,
      receiptName: null,
      taxId: null,
      phoneNumber: null,
    };
  }

  static toDomain(donorInfo: DonorInfo): DonorInfoEntity {
    return DonorInfoEntity.from({
      id: donorInfo.id,
      orderId: donorInfo.orderId,
      fullName: donorInfo.fullName,
      email: donorInfo.email,
      isGILMember: donorInfo.isGILMember,
      receiptRequest: donorInfo.receiptRequest,
      receiptName: donorInfo.receiptName,
      taxId: donorInfo.taxId,
      phoneNumber: donorInfo.phoneNumber,
    }).value;
  }

  static toPersistence(input: DonorInfoEntity): DonorInfo {
    return new DonorInfo({
      id: input.id.value,
      orderId: input.orderId.value,
      fullName: input.fullName,
      email: input.email.value,
      isGILMember: input.isGILMember,
      receiptRequest: input.receiptRequest,
      receiptName: input.receiptInfo?.name ?? null,
      taxId: input.receiptInfo?.taxId ?? null,
      phoneNumber: input.receiptInfo?.phoneNumber ?? null,
    });
  }
}
