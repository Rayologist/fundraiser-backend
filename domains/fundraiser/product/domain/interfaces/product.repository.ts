import { AbstractRepository } from '@common/ddd';
import { Product as ProductAggregateRoot } from '../product.aggregate-root';

export interface AbstractProductRepository
  extends AbstractRepository<ProductAggregateRoot> {
  findMany(): Promise<ProductAggregateRoot[]>;
  findManyByCampaignId(campaignId: string): Promise<ProductAggregateRoot[]>;
  findManyByIds(ids: string[]): Promise<ProductAggregateRoot[]>;
}
