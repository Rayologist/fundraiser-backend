import { generateRefreshToken } from '@common/crypto';
import { Result, ValueObject } from '@common/ddd';

type RefreshTokenProps = {
  value: string;
};

export class RefreshToken extends ValueObject<RefreshTokenProps> {
  get value() {
    return this.props.value;
  }

  static create() {
    const token = generateRefreshToken();
    return Result.Ok(new RefreshToken({ value: token }));
  }

  static from(token: string) {
    return Result.Ok(new RefreshToken({ value: token }));
  }
}
