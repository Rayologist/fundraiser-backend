import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly rawCartItemRepository: Repository<CartItem>,
  ) {}
  async findManyByIds(args: { userId: string; ids: string[] }) {
    return this.rawCartItemRepository.find({
      where: { id: In(args.ids), userId: args.userId },
      relations: ['product', 'product.campaign'],
    });
  }

  async findManyByUserId(id: string) {
    return this.rawCartItemRepository.find({
      where: { userId: id },
      relations: ['product', 'product.campaign'],
    });
  }
}
