import { Presenter } from '@common/ddd/presenter';
import { CartDto } from '@domains/fundraiser/cart/infrastructure/mappers/cart.mapper';
import { Campaign } from '@modules/postgres/entities/campaign.entity';
import type { CartItem } from '@modules/postgres/entities/cart-item.entity';
import type { Product } from '@modules/postgres/entities/product.entity';
import { Injectable } from '@nestjs/common';

type CartItemView = Pick<CartItem, 'id' | 'price' | 'quantity'> & {
  product: ProductView;
};

type ProductView = Pick<Product, 'id' | 'title'> & { campaign: CampaignView };

type CampaignView = Pick<Campaign, 'id' | 'title'>;

type CartView = {
  cartItems: CartItemView[];
  amount: number;
};

@Injectable()
export class GetCartPresenter implements Presenter {
  present(args: { cartItems: CartItem[] }): CartView {
    args.cartItems.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    const cartItemsView: CartItemView[] = args.cartItems.flatMap((cartItem) => {
      const product = cartItem.product;
      const campaign = product?.campaign;

      if (!product || !campaign) {
        return [];
      }

      return [
        {
          id: cartItem.id,
          price: cartItem.price,
          quantity: cartItem.quantity,
          product: {
            id: product.id,
            title: product.title,
            campaign: {
              id: campaign.id,
              title: campaign.title,
            },
          },
        },
      ];
    });

    return {
      cartItems: cartItemsView,
      amount: cartItemsView.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    };
  }
}
