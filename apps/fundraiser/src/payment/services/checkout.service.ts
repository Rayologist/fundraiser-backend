import { RemoveCartItemUseCase } from '@domains/fundraiser/cart/application/remove-cart-item/remove-cart-item.use-case';
import { CreateOrderUseCase } from '@domains/fundraiser/order/application/create-order/create-order.use-case';
import { CreatePaymentUseCase } from '@domains/fundraiser/payment/application/create-payment/create-payment.use-case';
import { CartItemRepository } from '@modules/postgres/repositories/cart-item.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NewebPayService } from './newebpay.service';
import { DonorInfoDto } from '../dtos/checkout.dto';
import { Product } from '@modules/postgres/entities/product.entity';
import { env } from '@common/environments/fundraiser.env';
import { OrderRepository } from '@modules/postgres/repositories/order.repository';
import { PaymentStatus } from '@domains/fundraiser/payment/domain/payment.aggregate-root';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly orderRepository: OrderRepository,
    private readonly newebpayService: NewebPayService,
  ) {}

  async checkout(args: {
    userId: string;
    cartItemIds: string[];
    donorInfo: DonorInfoDto;
  }) {
    const cartItems = await this.cartItemRepository.findManyByIds({
      userId: args.userId,
      ids: args.cartItemIds,
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    if (cartItems.length !== args.cartItemIds.length) {
      throw new BadRequestException('Some cart items not found');
    }

    // create order with cartItemIds, donorInfo
    const orderOrError = await this.createOrderUseCase.execute({
      userId: args.userId,
      orderItems: cartItems.map((cartItem) => {
        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.price,
          currency: cartItem.product?.currency!,
        };
      }),
      donorInfo: args.donorInfo,
    });

    if (orderOrError.isErr()) {
      throw orderOrError.error;
    }

    const order = orderOrError.value;

    const paymentOrError = await this.createPaymentUseCase.execute({
      userId: args.userId,
      orderId: order.id,
    });

    if (paymentOrError.isErr()) {
      throw paymentOrError.error;
    }

    const payment = paymentOrError.value;

    await this.removeCartItemUseCase.execute({
      userId: args.userId,
      cartItemIds: args.cartItemIds,
    });

    return this.newebpayService.requestPayment({
      orderId: payment.id,
      userId: args.userId,
      email: args.donorInfo.email,
      itemDesc: env.productDescription,
      amount: order.amount,
      orderComment: this.getOrderComment(cartItems),
    });
  }

  async checkoutByOrderId(args: { userId: string; orderId: string }) {
    const order = await this.orderRepository.findOrderById(args);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (!order.payments || !order.donorInfo || !order.orderItems) {
      throw new BadRequestException('Order is invalid');
    }

    const isPaid = order.payments.some((p) => p.status === PaymentStatus.PAID);

    if (isPaid) {
      throw new BadRequestException('Order is already paid');
    }

    const paymentOrError = await this.createPaymentUseCase.execute({
      userId: args.userId,
      orderId: args.orderId,
    });

    if (paymentOrError.isErr()) {
      throw paymentOrError.error;
    }

    const payment = paymentOrError.value;

    return this.newebpayService.requestPayment({
      orderId: payment.id,
      userId: args.userId,
      email: order.donorInfo.email,
      itemDesc: env.productDescription,
      amount: order.orderItems.reduce((acc, item) => acc + item.price, 0),
      orderComment: this.getOrderComment(order.orderItems),
    });
  }

  private getOrderComment(items: { price: number; product?: Product }[]) {
    const campaignAmountMap = this.groupAmountByCampaign(items);
    const currencyFormatter = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    });

    const campaignAmounts = Array.from(campaignAmountMap.entries()).map(
      ([campaign, amount]) => {
        return `${campaign}: ${currencyFormatter.format(amount)}`;
      },
    );

    const result = campaignAmounts.join('、');

    if (result.length > 300) {
      return result.slice(0, 297) + '...';
    }

    return result;
  }

  private groupAmountByCampaign(
    items: {
      price: number;
      product?: Product;
    }[],
  ) {
    const campaignMap = new Map<string, number>();

    items.forEach((item) => {
      const campaign = item.product?.campaign?.title || 'Unknown';
      const amount = campaignMap.get(campaign);
      if (amount) {
        campaignMap.set(campaign, amount + item.price);
      } else {
        campaignMap.set(campaign, item.price);
      }
    });

    return campaignMap;
  }
}
