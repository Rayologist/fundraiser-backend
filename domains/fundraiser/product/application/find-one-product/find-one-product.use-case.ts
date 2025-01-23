import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDomain } from '../../infrastructure/product.repository';
import { AbstractProductRepository } from '../../domain/interfaces/product.repository';
import {
  ProductDto,
  ProductMapper,
} from '../../infrastructure/mappers/product.mapper';

export type FindOneProductInput = { id: string };
export type FindOneProductOutput = Result<ProductDto, HttpException>;

@Injectable()
export class FindOneProductUseCase
  implements Query<FindOneProductInput, FindOneProductOutput>
{
  constructor(
    @Inject(ProductDomain.Repository)
    private readonly productRepository: AbstractProductRepository,
  ) {}
  async execute(input: FindOneProductInput) {
    try {
      const product = await this.productRepository.findOneById(input.id);
      if (!product) {
        return Result.Err(new NotFoundException('Product not found'));
      }
      return Result.Ok(ProductMapper.toDto(product));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
