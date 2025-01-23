import { InjectRepository } from '@nestjs/typeorm';
import { AbstractReceiptRepository } from '../domain/interfaces/receipt.repository';
import { Repository } from 'typeorm';
import { Receipt } from '@modules/postgres/entities/receipt.entity';
import { ReceiptMapper } from './mapper/receipt.mapper';
import { Receipt as ReceiptAggregateRoot } from '../domain/receipt.aggregate-root';

export const enum ReceiptDomain {
  Repository = 'ReceiptDomainRepository',
}
export class ReceiptDomainRepository implements AbstractReceiptRepository {
  constructor(
    @InjectRepository(Receipt)
    private readonly rawReceiptRepository: Repository<Receipt>,
  ) {}

  async findOneById(id: string) {
    const receipt = await this.rawReceiptRepository.findOneBy({ id });

    if (!receipt) {
      return null;
    }

    return ReceiptMapper.toDomain(receipt);
  }

  async save(data: ReceiptAggregateRoot): Promise<void> {
    const receipt = ReceiptMapper.toPersistence(data);
    await this.rawReceiptRepository.save(receipt);
  }
}
