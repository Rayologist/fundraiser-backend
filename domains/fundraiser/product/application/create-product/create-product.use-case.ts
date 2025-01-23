import { Command, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ProductDomain } from '../../infrastructure/product.repository';
import { AbstractProductRepository } from '../../domain/interfaces/product.repository';
import { Product } from '../../domain/product.aggregate-root';
import { Currency } from '@common/ddd/money';

export type CreateProductInput = {
  title: string;
  description: string;
  campaignId: string;
  pictures: string[];
  goalAmount: number;
  currency: Currency;
  active: boolean;
};

export type CreateProductOutput = Result<{ id: string }, HttpException>;

@Injectable()
export class CreateProductUseCase
  implements Command<CreateProductInput, CreateProductOutput>
{
  constructor(
    @Inject(ProductDomain.Repository)
    private readonly productRepository: AbstractProductRepository,
  ) {}
  async execute(input: CreateProductInput) {
    try {
      const product = Product.create({
        title: input.title,
        description: input.description,
        campaignId: input.campaignId,
        pictures: input.pictures,
        goalAmount: input.goalAmount,
        currency: input.currency,
        active: input.active,
      });

      if (product.isErr()) {
        return Result.Err(new BadRequestException(product.error));
      }

      await this.productRepository.save(product.value);

      return Result.Ok({ id: product.value.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
