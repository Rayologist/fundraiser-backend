import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitController } from './init.controller';
import { CampaignDomainModule } from '@domains/fundraiser/campaign/campaign.module';
import { ProductDomainModule } from '@domains/fundraiser/product/product.module';

@Module({
  imports: [CampaignDomainModule, ProductDomainModule],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
