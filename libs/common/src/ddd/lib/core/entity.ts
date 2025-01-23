import { EntityId } from '../entity-id';

export abstract class Entity<
  Id extends EntityId<unknown>,
  Props extends Record<string, unknown>,
> {
  constructor(
    readonly id: Id,
    protected props: Props,
  ) {}

  equals(other?: Entity<EntityId<unknown>, Record<string, unknown>>) {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof this.constructor)) {
      return false;
    }

    return other.id.equals(this.id);
  }
}
