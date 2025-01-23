import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserGuard } from '../guards/user.guard';
import { Ctx } from '@common/decorators/context.decorator';
import { Context } from '../types';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@Controller('cart')
@UseGuards(UserGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Ctx() ctx: Context) {
    return this.cartService.getCart({ userId: ctx.user.id });
  }

  @Delete()
  @HttpCode(204)
  clearCart(@Ctx() ctx: Context) {
    return this.cartService.clearCart({ userId: ctx.user.id });
  }

  @Delete('/items/:cartItemId')
  @HttpCode(204)
  removeCartItem(@Ctx() ctx: Context, @Param('cartItemId') cartItemId: string) {
    return this.cartService.removeCartItem({
      userId: ctx.user.id,
      cartItemId: cartItemId,
    });
  }

  @Post('/items')
  addCartItem(@Ctx() ctx: Context, @Body() dto: AddCartItemDto) {
    return this.cartService.addCartItem({
      userId: ctx.user.id,
      productId: dto.productId,
    });
  }

  @Patch('/items/:cartItemId')
  updateCartItem(
    @Ctx() ctx: Context,
    @Body() dto: UpdateCartItemDto,
    @Param('cartItemId') cartItemId: string,
  ) {
    return this.cartService.updateCartItem({
      userId: ctx.user.id,
      cartItemId: cartItemId,
      price: dto.price,
    });
  }
}
