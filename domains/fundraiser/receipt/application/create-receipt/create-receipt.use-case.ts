import { Command, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Currency } from '@common/ddd/money';
import { ReceiptDomain } from '../../infrastructure/receipt.repository';
import { AbstractReceiptRepository } from '../../domain/interfaces/receipt.repository';
import { Receipt } from '../../domain/receipt.aggregate-root';

export type CreateReceiptInput = {
  userId: string;
  orderId: string;
  donorInfoId: string;
  description: string;
  notes: string | null;
};

export type CreateReceiptOutput = Result<{ id: string }, HttpException>;

@Injectable()
export class CreateReceiptUseCase
  implements Command<CreateReceiptInput, CreateReceiptOutput>
{
  constructor(
    @Inject(ReceiptDomain.Repository)
    private readonly receiptRepository: AbstractReceiptRepository,
  ) {}
  async execute(input: CreateReceiptInput) {
    try {
      const product = Receipt.create({
        userId: input.userId,
        orderId: input.orderId,
        donorInfoId: input.donorInfoId,
        description: input.description,
        notes: input.notes,
      });

      if (product.isErr()) {
        return Result.Err(new BadRequestException(product.error));
      }

      await this.receiptRepository.save(product.value);

      return Result.Ok({ id: product.value.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
