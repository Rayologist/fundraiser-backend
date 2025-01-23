import { FindAllProductUseCase } from '@domains/fundraiser/product/application/find-all-products/find-all-products.use-case';
import { FindOneProductUseCase } from '@domains/fundraiser/product/application/find-one-product/find-one-product.use-case';
import { Campaign } from '@modules/postgres/entities/campaign.entity';
import { Product } from '@modules/postgres/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly findAllProductsUseCase: FindAllProductUseCase,
    private readonly findOneOneUseCase: FindOneProductUseCase,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(args?: { campaignId?: string }) {
    const result = await this.findAllProductsUseCase.execute(args);

    if (result.isErr()) {
      throw result.error;
    }

    return result.value;
  }

  async findOne(id: string) {
    const result = await this.findOneOneUseCase.execute({ id });

    if (result.isErr()) {
      throw result.error;
    }

    return result.value;
  }

  async findRecommended(): Promise<
    Partial<Product> & { campaign?: Partial<Campaign> }[]
  > {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.campaign', 'campaign')
      .addSelect('(product.currentAmount * 1.0) / product.goalAmount', 'ratio')
      .where('campaign.deleted = false')
      .andWhere('campaign.active = true')
      .andWhere('product.deleted = false')
      .andWhere('product.active = true')
      .andWhere('product.goalAmount > 0')
      .orderBy('ratio', 'ASC')
      // .addOrderBy('product.totalContributors', 'ASC')
      .limit(20)
      .getMany();

    return products.flatMap((product) => {
      if (!product.campaign) {
        return [];
      }

      return [
        {
          id: product.id,
          title: product.title,
          description: product.description,
          currentAmount: product.currentAmount,
          goalAmount: product.goalAmount,
          campaign: {
            id: product.campaign.id,
            title: product.campaign.title,
          },
        },
      ];
    });
  }
}
