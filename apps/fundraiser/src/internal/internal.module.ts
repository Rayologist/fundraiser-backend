import { Module } from '@nestjs/common';
import { InternalService } from './internal.service';
import { InternalController } from './internal.controller';
import { CampaignDomainModule } from '@domains/fundraiser/campaign/campaign.module';
import { ProductDomainModule } from '@domains/fundraiser/product/product.module';
import { MailerModule } from '@common/mailer/mailer.module';

@Module({
  imports: [CampaignDomainModule, ProductDomainModule, MailerModule],
  controllers: [InternalController],
  providers: [InternalService],
})
export class InternalModule {}
