import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { Ctx } from '@common/decorators/context.decorator';
import { Context } from '../types';
import { UserGuard } from '../guards/user.guard';

@Controller('payment')
@UseGuards(UserGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto, @Ctx() ctx: Context) {
    return this.paymentService.checkout({
      userId: ctx.user.id,
      cartItemIds: dto.cartItemIds,
      donorInfo: dto.donorInfo,
    });
  }

  @Get('checkout/:orderId')
  async checkoutById(@Param('orderId') orderId: string, @Ctx() ctx: Context) {
    return this.paymentService.checkoutById({
      orderId,
      userId: ctx.user.id,
    });
  }
}
