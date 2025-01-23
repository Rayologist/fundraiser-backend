import { AggregateRoot, Result } from '@common/ddd';
import { ProductId } from './value-objects/product-id.value-object';
import { Currency, Money } from '@common/ddd/money';
import { CampaignId } from 'domains/fundraiser/campaign/domain/value-objects/campaign-id.value-object';

export type ProductAggregateRootProps = {
  campaignId: CampaignId;
  title: string;
  description: string;
  pictures: string[];
  goalAmount: Money;
  currentAmount: Money;
  totalContributors: number;
  active: boolean;
  deleted: boolean;
};

export type ProductProps = {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  pictures: string[];
  goalAmount: number;
  currency: Currency;
  currentAmount: number;
  totalContributors: number;
  active: boolean;
  deleted: boolean;
};

export class Product extends AggregateRoot<
  ProductId,
  ProductAggregateRootProps
> {
  get campaignId() {
    return this.props.campaignId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get pictures() {
    return this.props.pictures;
  }

  get goalAmount() {
    return this.props.goalAmount;
  }

  get currentAmount() {
    return this.props.currentAmount;
  }

  get totalContributors() {
    return this.props.totalContributors;
  }

  get active() {
    return this.props.active;
  }

  get deleted() {
    return this.props.deleted;
  }

  setCurrentAmount(value: Money) {
    return Result.Err(
      'Current amount should not be handled in domain model due to potential race condition',
    );
  }

  setTotalContributors(value: number) {
    return Result.Err(
      'Total contributors should be be handled in domain model due to potential race condition',
    );
  }

  activate() {
    this.props.active = true;
    return Result.Ok(null);
  }

  deactivate() {
    this.props.active = false;
    return Result.Ok(null);
  }

  remove() {
    this.props.deleted = true;
    return Result.Ok(null);
  }

  restore() {
    this.props.deleted = false;
    return Result.Ok(null);
  }

  setGoalAmount(value: Money) {
    this.props.goalAmount = value;
    return Result.Ok(null);
  }

  static create(
    props: Omit<
      ProductProps,
      'id' | 'deleted' | 'currentAmount' | 'totalContributors'
    >,
  ) {
    const id = ProductId.create().value;
    const campaignId = CampaignId.from(props.campaignId).value;
    const goalAmountOrError = Money.create({
      value: props.goalAmount,
      currency: props.currency,
    });
    const currentAmountOrError = Money.create({
      value: 0,
      currency: props.currency,
    });

    const results = Result.all([goalAmountOrError, currentAmountOrError]);

    if (results.isErr()) {
      return Result.Err(results.error);
    }

    const [goalAmount, currentAmount] = results.value;

    return Result.Ok(
      new Product(id, {
        campaignId,
        title: props.title,
        description: props.description,
        pictures: props.pictures,
        goalAmount,
        currentAmount,
        totalContributors: 0,
        active: props.active,
        deleted: false,
      }),
    );
  }

  static from(props: ProductProps) {
    const id = ProductId.from(props.id).value;
    const campaignId = CampaignId.from(props.campaignId).value;
    const goalAmount = Money.from({
      value: props.goalAmount,
      currency: props.currency,
    }).value;
    const currentAmount = Money.from({
      value: props.currentAmount,
      currency: props.currency,
    }).value;

    return Result.Ok(
      new Product(id, {
        campaignId,
        title: props.title,
        description: props.description,
        pictures: props.pictures,
        goalAmount,
        currentAmount,
        totalContributors: props.totalContributors,
        active: props.active,
        deleted: props.deleted,
      }),
    );
  }
}
