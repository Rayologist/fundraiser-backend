import { Module } from '@nestjs/common';
import { CreateCampaignUseCase } from './application/create-campaign/create-campaign.use-case';
import {
  CampaignDomain,
  CampaignDomainRepository,
} from './infrastructure/campaign.repository';
import { FindOneCampaignUseCase } from './application/find-one-campaign/find-one-campaign.use-case';
import { FindAllCampaignsUseCase } from './application/find-all-campaigns/find-all-campaigns.use-case';

const useCases = [
  CreateCampaignUseCase,
  FindOneCampaignUseCase,
  FindAllCampaignsUseCase,
];

@Module({
  imports: [],
  providers: [
    {
      provide: CampaignDomain.Repository,
      useClass: CampaignDomainRepository,
    },
    ...useCases,
  ],
  exports: [...useCases],
})
export class CampaignDomainModule {}
