import { Query, Result } from '@common/ddd';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CampaignDomain } from '../../infrastructure/campaign.repository';
import { AbstractCampaignRepository } from '../../domain/interfaces/campaign.repository';
import {
  CampaignDto,
  CampaignMapper,
} from '../../infrastructure/mappers/campaign.mapper';

export type FindOneCampaignInput = { id: string };
export type FindOneCampaignOutput = Result<CampaignDto, HttpException>;

@Injectable()
export class FindOneCampaignUseCase
  implements Query<FindOneCampaignInput, FindOneCampaignOutput>
{
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: AbstractCampaignRepository,
  ) {}

  async execute(input: FindOneCampaignInput) {
    try {
      const campaign = await this.campaignRepository.findOneById(input.id);

      if (!campaign) {
        return Result.Err(new NotFoundException('Campaign not found'));
      }

      return Result.Ok(CampaignMapper.toDto(campaign));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
