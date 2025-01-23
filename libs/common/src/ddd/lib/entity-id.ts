import { ValueObject } from './core/value-object';

type EntityIdProps<T> = {
  value: T;
};

export abstract class EntityId<T> extends ValueObject<EntityIdProps<T>> {
  constructor(value: T) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  equals(other?: EntityId<any>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof this.constructor)) {
      return false;
    }

    return other.value === this.value;
  }
}
