import { Command, Result } from '@common/ddd';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AbstractCampaignRepository } from '../../domain/interfaces/campaign.repository';
import { CampaignDomain } from '../../infrastructure/campaign.repository';
import { Campaign } from '../../domain/campaign.aggregate-root';
import { CampaignConfigProps } from '../../domain/value-objects/campaign-config.value-object';

export type CreateCampaignInput = {
  title: string;
  description: string;
  longDescription: string;
  config: CampaignConfigProps;
  pictures: string[];
  active: boolean;
};

export type CreateCampaignOutput = Result<{ id: string }, HttpException>;

@Injectable()
export class CreateCampaignUseCase
  implements Command<CreateCampaignInput, CreateCampaignOutput>
{
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: AbstractCampaignRepository,
  ) {}
  async execute(input: CreateCampaignInput) {
    try {
      const campaign = Campaign.create({
        title: input.title,
        description: input.description,
        longDescription: input.longDescription,
        config: input.config,
        active: input.active,
        pictures: input.pictures,
      });

      if (campaign.isErr()) {
        return Result.Err(new BadRequestException(campaign.error));
      }

      await this.campaignRepository.save(campaign.value);

      return Result.Ok({ id: campaign.value.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
