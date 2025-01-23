import { Campaign as CampaignAggregateRoot } from '../domain/campaign.aggregate-root';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCampaignRepository } from '../domain/interfaces/campaign.repository';
import { Campaign } from '@modules/postgres/entities/campaign.entity';
import { CampaignMapper } from './mappers/campaign.mapper';

export const enum CampaignDomain {
  Repository = 'CampaignDomainRepository',
}

@Injectable()
export class CampaignDomainRepository implements AbstractCampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly rawCampaignRepository: Repository<Campaign>,
  ) {}
  async findOneById(id: string): Promise<CampaignAggregateRoot | null> {
    const campaign = await this.rawCampaignRepository.findOneBy({ id });

    if (!campaign) {
      return null;
    }

    return CampaignMapper.toDomain(campaign);
  }

  async findMany(): Promise<CampaignAggregateRoot[]> {
    const campaigns = await this.rawCampaignRepository.find();

    return campaigns.map((campaign) => CampaignMapper.toDomain(campaign));
  }

  async save(data: CampaignAggregateRoot): Promise<void> {
    const campaign = CampaignMapper.toPersistence(data);
    await this.rawCampaignRepository.save(campaign);
  }
}
