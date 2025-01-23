import { InjectRepository } from '@nestjs/typeorm';
import { AbstractCartRepository } from '../domain/interfaces/cart.repository';
import { Cart as CartAggregateRoot } from '../domain/cart.aggregate-root';
import { DeleteResult, Repository } from 'typeorm';
import { CartItem } from '@modules/postgres/entities/cart-item.entity';
import { CartItemMapper } from './mappers/cart-item.mapper';
import { CartItem as CartItemEntity } from '../domain/entities/cart-item.entity';
import { CartMapper } from './mappers/cart.mapper';
import { Currency } from '@common/ddd/money';

export const enum CartDomain {
  Repository = 'CartDomainRepository',
}

export class CartDomainRepository implements AbstractCartRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findOneById(id: string) {
    const cartItems = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoin('cartItem.product', 'product')
      .addSelect(['product.currency'])
      .where('cartItem.userId = :id', { id })
      .getMany();

    if (!cartItems || cartItems.length === 0) {
      return null;
    }

    type Item = CartItem & { currency: Currency };
    const items: Item[] = [];

    for (const item of cartItems) {
      const currency = item?.product?.currency;

      if (!currency) {
        return null;
      }

      const i = item as Item;
      i.currency = currency;

      items.push(i);
    }

    return CartMapper.toDomain({
      userId: id,
      cartItems: items,
    });
  }

  async saveItem(cartItem: CartItemEntity): Promise<void> {
    const item = CartItemMapper.toPersistence(cartItem);
    await this.cartItemRepository.save(item);
  }

  async save(cart: CartAggregateRoot) {
    const toAdd = cart.items.newItems.map((item) =>
      CartItemMapper.toPersistence(item),
    );

    const toRemove = cart.items.removedItems.map((item) => item.id.value);

    const promises: Promise<CartItem[] | DeleteResult>[] = [];

    if (toAdd.length > 0) {
      promises.push(this.cartItemRepository.save(toAdd));
    }

    if (toRemove.length > 0) {
      promises.push(this.cartItemRepository.delete(toRemove));
    }

    await Promise.all(promises);
  }
}
