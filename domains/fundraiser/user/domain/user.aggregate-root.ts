import { AggregateRoot, Result } from '@common/ddd';
import { UserId } from './value-objects/user-id.value-object';
import { Avatar } from './value-objects/avatar.value-object';
import { Email } from '@common/ddd/value-objects/email.value-object';
import { RefreshToken } from './value-objects/refresh-token.value-object';

type UserAggregateRootProps = {
  avatar: Avatar;
  email: Email;
  firstName: string;
  lastName: string;
  refreshToken: RefreshToken;
};

export type UserProps = {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
};

export type CreateUserProps = Omit<UserProps, 'id' | 'refreshToken'>;

export class User extends AggregateRoot<UserId, UserAggregateRootProps> {
  get email() {
    return this.props.email;
  }

  get avatar() {
    return this.props.avatar;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  updateRefreshToken() {
    const token = RefreshToken.create();
    this.props.refreshToken = token.value;
    return Result.Ok(token.value);
  }

  static create(props: CreateUserProps) {
    const id = UserId.create();
    const avatarOrError = Avatar.create(props.avatar);
    const emailOrError = Email.create(props.email);
    const token = RefreshToken.create();

    const results = Result.all([avatarOrError, emailOrError]);

    if (results.isErr()) {
      return results;
    }

    const [avatar, email] = results.value;

    return Result.Ok(
      new User(id.value, {
        avatar: avatar,
        email: email,
        firstName: props.firstName,
        lastName: props.lastName,
        refreshToken: token.value,
      }),
    );
  }

  static from(props: UserProps) {
    return Result.Ok(
      new User(UserId.from(props.id).value, {
        avatar: Avatar.from(props.avatar).value,
        email: Email.from(props.email).value,
        firstName: props.firstName,
        lastName: props.lastName,
        refreshToken: RefreshToken.from(props.refreshToken).value,
      }),
    );
  }
}
