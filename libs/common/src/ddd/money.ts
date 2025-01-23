import { ValueObject } from './lib';
import { Result } from './result';

export const enum Currency {
  TWD = 'TWD',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  CNY = 'CNY',
  KRW = 'KRW',
}

type MoneyVOProps = {
  value: number;
  currency: Currency;
};

export type MoneyProps = {
  value: number;
  currency: Currency;
};

export class Money extends ValueObject<MoneyVOProps> {
  get value() {
    return this.props.value;
  }

  get currency() {
    return this.props.currency;
  }

  static create(props: MoneyProps) {
    if (Number.isNaN(props.value)) {
      return Result.Err('Amount must be a number');
    }

    if (props.value < 0) {
      return Result.Err('Amount must be greater than or equal to zero');
    }

    return Result.Ok(new Money(props));
  }

  static from(props: MoneyProps) {
    return Result.Ok(new Money(props));
  }
}
