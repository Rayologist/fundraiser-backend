import { Result, ValueObject } from '@common/ddd';
import { isEmail } from 'validator';

export type EmailVOProps = {
  value: string;
};

export class Email extends ValueObject<EmailVOProps> {
  get value() {
    return this.props.value;
  }

  static create(email: string) {
    if (email.length >= 254) {
      return Result.Err('Email length must be less than 254 characters');
    }

    if (!isEmail(email)) {
      return Result.Err('Invalid email');
    }

    return Result.Ok(new Email({ value: email }));
  }

  static from(email: string) {
    return Result.Ok(new Email({ value: email }));
  }
}
