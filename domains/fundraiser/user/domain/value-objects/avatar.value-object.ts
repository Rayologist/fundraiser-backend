import { Result, ValueObject } from '@common/ddd';
import { isURL } from 'validator';

type AvatarVOProps = {
  value: string;
};

export class Avatar extends ValueObject<AvatarVOProps> {
  get value() {
    return this.props.value;
  }

  static create(avatar: string) {
    if (!isURL(avatar)) {
      return Result.Err('Invalid avatar URL');
    }

    return Result.Ok(new Avatar({ value: avatar }));
  }

  static from(avatar: string) {
    return Result.Ok(new Avatar({ value: avatar }));
  }
}
