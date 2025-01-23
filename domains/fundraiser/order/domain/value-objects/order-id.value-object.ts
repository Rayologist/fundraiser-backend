import { EntityId, Result } from '@common/ddd';
import { getRandomInt } from '@common/utils/random-int';

export class OrderId extends EntityId<string> {
  private static generate() {
    const [d, t] = new Date().toISOString().split('T');

    const date = d.replace(/-/g, '').slice(2);
    const time = t.replace(/:|\.|Z/g, '');
    const random = getRandomInt(1000, 9999).toString();

    return date + time + random;
  }

  static create() {
    const id = OrderId.generate();
    return Result.Ok(new OrderId(id));
  }

  static from(id: string) {
    return Result.Ok(new OrderId(id));
  }
}
