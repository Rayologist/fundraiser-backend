import { FindAllCampaignsUseCase } from '@domains/fundraiser/campaign/application/find-all-campaigns/find-all-campaigns.use-case';
import { FindOneCampaignUseCase } from '@domains/fundraiser/campaign/application/find-one-campaign/find-one-campaign.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignService {
  constructor(
    private readonly findAllCampaignsUseCase: FindAllCampaignsUseCase,
    private readonly findOneCampaignUseCase: FindOneCampaignUseCase,
  ) {}

  async findAll() {
    const result = await this.findAllCampaignsUseCase.execute();

    if (result.isErr()) {
      throw result.error;
    }

    return result.value;
  }

  async findOne(id: string) {
    const result = await this.findOneCampaignUseCase.execute({ id });

    if (result.isErr()) {
      throw result.error;
    }

    return result.value;
  }
}
