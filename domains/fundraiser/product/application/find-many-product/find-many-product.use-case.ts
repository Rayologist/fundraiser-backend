import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductDomain } from '../../infrastructure/product.repository';
import { AbstractProductRepository } from '../../domain/interfaces/product.repository';
import {
  ProductDto,
  ProductMapper,
} from '../../infrastructure/mappers/product.mapper';

export type FindManyProductInput = { ids: string[] };
export type FindManyProductOutput = Result<ProductDto[], HttpException>;

@Injectable()
export class FindManyProductUseCase
  implements Query<FindManyProductInput, FindManyProductOutput>
{
  constructor(
    @Inject(ProductDomain.Repository)
    private readonly productRepository: AbstractProductRepository,
  ) {}
  async execute(input: FindManyProductInput) {
    try {
      const products = await this.productRepository.findManyByIds(input.ids);
      return Result.Ok(products.map((product) => ProductMapper.toDto(product)));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
