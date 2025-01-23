import { EntityId } from './lib';
import { ulid } from 'ulidx';
import { Result } from './result';

export class Ulid extends EntityId<string> {
  static create() {
    const id = ulid();
    return Result.Ok(new Ulid(id));
  }

  static from(id: string) {
    return Result.Ok(new Ulid(id));
  }
}
