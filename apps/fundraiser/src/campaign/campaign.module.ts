import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CampaignDomainModule } from '@domains/fundraiser/campaign/campaign.module';

@Module({
  imports: [CampaignDomainModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
