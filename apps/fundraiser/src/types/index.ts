import { User } from '@modules/postgres/entities/user.entity';

export type Context = {
  user: User;
};
