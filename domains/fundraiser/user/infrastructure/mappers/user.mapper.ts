import { User as UserAggregate } from '../../domain/user.aggregate-root';
import { User as UserPO } from '@modules/postgres/entities/user.entity';

export interface UserDto {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
}

export class UserMapper {
  static toDto(input: UserAggregate): UserDto {
    return {
      id: input.id.value,
      avatar: input.avatar.value,
      email: input.email.value,
      firstName: input.firstName,
      lastName: input.lastName,
      refreshToken: input.refreshToken.value,
    };
  }

  static toDomain(input: UserPO): UserAggregate {
    return UserAggregate.from({
      id: input.id,
      avatar: input.picture,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      refreshToken: input.refreshToken,
    }).value;
  }

  static toPersistence(input: UserAggregate): UserPO {
    return new UserPO({
      id: input.id.value,
      picture: input.avatar.value,
      email: input.email.value,
      firstName: input.firstName,
      lastName: input.lastName,
      refreshToken: input.refreshToken.value,
    });
  }
}
