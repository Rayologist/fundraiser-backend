import { isDeepEqual } from '../utils';

export abstract class ValueObject<T extends Record<string, unknown>> {
  readonly props: T;
  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  equals(other?: ValueObject<any>) {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof this.constructor)) {
      return false;
    }

    return isDeepEqual(other.props, this.props);
  }
}
