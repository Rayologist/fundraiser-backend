import { AbstractRepository } from '@common/ddd';
import { User as UserAggregateRoot } from '../user.aggregate-root';

export interface AbstractUserRepository
  extends AbstractRepository<UserAggregateRoot> {
  findOneByEmail(email: string): Promise<UserAggregateRoot | null>;
}
