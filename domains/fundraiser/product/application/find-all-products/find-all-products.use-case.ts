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
import { Product } from '../../domain/product.aggregate-root';

export type FindAllProductInput = {};
export type FindAllProductOutput = Result<ProductDto[], HttpException>;

@Injectable()
export class FindAllProductUseCase
  implements Query<FindAllProductInput, FindAllProductOutput>
{
  constructor(
    @Inject(ProductDomain.Repository)
    private readonly productRepository: AbstractProductRepository,
  ) {}
  async execute(args?: { campaignId?: string }) {
    try {
      let products: Product[] = [];

      if (args?.campaignId) {
        products = await this.productRepository.findManyByCampaignId(
          args.campaignId,
        );
      } else {
        products = await this.productRepository.findMany();
      }

      return Result.Ok(products.map((product) => ProductMapper.toDto(product)));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
