import { Product as ProductAggregateRoot } from '../domain/product.aggregate-root';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AbstractProductRepository } from '../domain/interfaces/product.repository';
import { ProductMapper } from './mappers/product.mapper';
import { Product } from '@modules/postgres/entities/product.entity';

export const enum ProductDomain {
  Repository = 'ProductDomainRepository',
}

@Injectable()
export class ProductDomainRepository implements AbstractProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly rawProductRepository: Repository<Product>,
  ) {}
  async findOneById(id: string): Promise<ProductAggregateRoot | null> {
    const product = await this.rawProductRepository.findOne({
      where: { id, deleted: false, active: true },
    });

    if (!product) {
      return null;
    }

    return ProductMapper.toDomain(product);
  }

  async findMany(): Promise<ProductAggregateRoot[]> {
    const products = await this.rawProductRepository.find({
      where: { deleted: false, active: true },
    });

    return products.map((product) => ProductMapper.toDomain(product));
  }

  async findManyByIds(ids: string[]): Promise<ProductAggregateRoot[]> {
    const products = await this.rawProductRepository.find({
      where: { id: In(ids), deleted: false, active: true },
    });

    return products.map((product) => ProductMapper.toDomain(product));
  }

  async findManyByCampaignId(
    campaignId: string,
  ): Promise<ProductAggregateRoot[]> {
    const products = await this.rawProductRepository.find({
      where: { campaignId, deleted: false, active: true },
    });

    return products.map((product) => ProductMapper.toDomain(product));
  }

  async save(data: ProductAggregateRoot): Promise<void> {
    const product = ProductMapper.toPersistence(data);
    await this.rawProductRepository.save(product);
  }
}
