import { Product } from '@modules/postgres/entities/product.entity';
import { Product as ProductAggregateRoot } from '../../domain/product.aggregate-root';
import { Currency } from '@common/ddd/money';

export interface ProductDto {
  id: string;
  title: string;
  description: string;
  pictures: string[];
  goalAmount: number;
  currency: Currency;
  currentAmount: number;
  totalContributors: number;
}

export class ProductMapper {
  static toDto(input: ProductAggregateRoot): ProductDto {
    return {
      id: input.id.value,
      title: input.title,
      description: input.description,
      pictures: input.pictures,
      goalAmount: input.goalAmount.value,
      currency: input.goalAmount.currency,
      currentAmount: input.currentAmount.value,
      totalContributors: input.totalContributors,
    };
  }
  static toDomain(input: Product): ProductAggregateRoot {
    return ProductAggregateRoot.from({
      id: input.id,
      campaignId: input.campaignId,
      title: input.title,
      description: input.description,
      pictures: input.pictures,
      goalAmount: input.goalAmount,
      currentAmount: input.currentAmount,
      currency: input.currency,
      totalContributors: input.totalContributors,
      active: input.active,
      deleted: input.deleted,
    }).value;
  }
  static toPersistence(input: ProductAggregateRoot): Product {
    return new Product({
      id: input.id.value,
      campaignId: input.campaignId.value,
      title: input.title,
      description: input.description,
      pictures: input.pictures,
      goalAmount: input.goalAmount.value,
      currentAmount: input.currentAmount.value,
      currency: input.goalAmount.currency,
      totalContributors: input.totalContributors,
      active: input.active,
      deleted: input.deleted,
    });
  }
}
