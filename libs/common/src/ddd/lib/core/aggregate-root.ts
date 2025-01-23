import { DomainEvent } from './domain-event';
import { Entity } from './entity';
import { EntityId } from '../entity-id';

export abstract class AggregateRoot<
  Id extends EntityId<unknown>,
  Props extends Record<string, unknown>,
> extends Entity<Id, Props> {
  private _domainEvents: DomainEvent[] = [];

  constructor(id: Id, props: Props) {
    super(id, props);
  }

  get domainEvents() {
    return this._domainEvents;
  }

  addEvent(event: DomainEvent) {
    this._domainEvents.push(event);
  }

  addEvents(events: DomainEvent[]) {
    this._domainEvents.push(...events);
  }

  clearEvents() {
    this._domainEvents = [];
  }
}
