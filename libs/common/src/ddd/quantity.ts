import { ValueObject } from './lib';
import { Result } from './result';

type QuantityVOProps = {
  value: number;
};

export class Quantity extends ValueObject<QuantityVOProps> {
  get value() {
    return this.props.value;
  }

  public static create(value: number) {
    if (value < 0) {
      return Result.Err('Quantity must be greater than or equal to zero.');
    }

    if (Number.isInteger(value) === false) {
      return Result.Err('Quantity must be an integer.');
    }

    return Result.Ok(new Quantity({ value }));
  }

  static from(value: number) {
    return Result.Ok(new Quantity({ value }));
  }
}
