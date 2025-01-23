import { Campaign } from '@modules/postgres/entities/campaign.entity';
import { Campaign as CampaignAggregateRoot } from '../../domain/campaign.aggregate-root';

export interface CampaignDto {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  config: {
    color: {
      primary: string;
      secondary: string;
    };
  };
  pictures: string[];
}

export class CampaignMapper {
  static toDto(input: CampaignAggregateRoot): CampaignDto {
    return {
      id: input.id.value,
      title: input.title,
      description: input.description,
      longDescription: input.longDescription,
      config: {
        color: input.config.color,
      },
      pictures: input.pictures,
    };
  }
  static toDomain(input: Campaign): CampaignAggregateRoot {
    return CampaignAggregateRoot.from({
      id: input.id,
      title: input.title,
      description: input.description,
      longDescription: input.longDescription,
      active: input.active,
      pictures: input.pictures,
      config: input.config,
      deleted: input.deleted,
    }).value;
  }
  static toPersistence(input: CampaignAggregateRoot): Campaign {
    return new Campaign({
      id: input.id.value,
      title: input.title,
      description: input.description,
      longDescription: input.longDescription,
      active: input.active,
      pictures: input.pictures,
      config: input.config.value,
      deleted: input.deleted,
    });
  }
}
