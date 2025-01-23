import { AbstractRepository } from '@common/ddd';
import { Campaign } from '../campaign.aggregate-root';

export interface AbstractCampaignRepository
  extends AbstractRepository<Campaign> {
  findMany(): Promise<Campaign[]>;
}
