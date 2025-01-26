import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JWTService } from './jwt/jwt.service';
import { HealthModule } from './health/health.module';
import { CartModule } from './cart/cart.module';
import { SessionModule } from './session/session.module';
import { InternalModule } from './internal/internal.module';
import { CampaignModule } from './campaign/campaign.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RecordModule } from './record/record.module';
import { ReceiptDomainModule } from '@domains/fundraiser/receipt/receipt.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    CartModule,
    SessionModule,
    InternalModule,
    CampaignModule,
    ProductModule,
    PaymentModule,
    EventEmitterModule.forRoot(),
    RecordModule,
    ReceiptDomainModule,
  ],
  controllers: [],
  providers: [JWTService],
})
export class FundraiserModule {}
