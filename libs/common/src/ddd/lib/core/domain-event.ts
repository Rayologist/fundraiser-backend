import { ValueObject } from './value-object';

export abstract class DomainEvent<
  DomainEventProps extends Record<string, unknown> = Record<string, unknown>,
> extends ValueObject<DomainEventProps & { timestamp: Date }> {
  constructor(
    readonly eventName: string,
    props: DomainEventProps,
  ) {
    const timestamp = new Date();
    super({ ...props, timestamp });
  }

  get timestamp() {
    return this.props.timestamp;
  }
}

export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): void | Promise<void>;
}
