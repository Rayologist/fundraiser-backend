import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CampaignDomain } from '../../infrastructure/campaign.repository';
import { AbstractCampaignRepository } from '../../domain/interfaces/campaign.repository';
import {
  CampaignDto,
  CampaignMapper,
} from '../../infrastructure/mappers/campaign.mapper';

export type FindAllCampaignInput = {};
export type FindAllCampaignOutput = Result<CampaignDto[], HttpException>;

@Injectable()
export class FindAllCampaignsUseCase
  implements Query<FindAllCampaignInput, FindAllCampaignOutput>
{
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: AbstractCampaignRepository,
  ) {}

  async execute() {
    try {
      const campaigns = await this.campaignRepository.findMany();
      return Result.Ok(
        campaigns.map((campaign) => CampaignMapper.toDto(campaign)),
      );
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
