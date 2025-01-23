import { AggregateRoot, Result } from '@common/ddd';
import { CampaignId } from './value-objects/campaign-id.value-object';
import {
  CampaignConfig,
  CampaignConfigProps,
} from './value-objects/campaign-config.value-object';

export type CampaignAggregateRootProps = {
  title: string;
  description: string;
  longDescription: string;
  pictures: string[];
  config: CampaignConfig;
  active: boolean;
  deleted: boolean;
};

export type CampaignProps = {
  title: string;
  description: string;
  longDescription: string;
  pictures: string[];
  config: CampaignConfigProps;
  active: boolean;
  deleted: boolean;
};

export class Campaign extends AggregateRoot<
  CampaignId,
  CampaignAggregateRootProps
> {
  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get pictures() {
    return this.props.pictures;
  }

  get active() {
    return this.props.active;
  }

  get deleted() {
    return this.props.deleted;
  }

  get config() {
    return this.props.config;
  }

  get longDescription() {
    return this.props.longDescription;
  }

  changeConfig(props: CampaignConfigProps) {
    const result = CampaignConfig.create(props);

    if (result.isErr()) {
      return Result.Err(result.error);
    }

    this.props.config = result.value;

    return Result.Ok(null);
  }

  activate() {
    this.props.active = true;
    return Result.Ok(null);
  }

  deactivate() {
    this.props.active = false;
    return Result.Ok(null);
  }

  remove() {
    this.props.deleted = true;
    return Result.Ok(null);
  }

  restore() {
    this.props.deleted = false;
    return Result.Ok(null);
  }

  static create(props: Omit<CampaignProps, 'deleted'>) {
    const id = CampaignId.create().value;
    const config = CampaignConfig.create(props.config);

    if (config.isErr()) {
      return Result.Err(config.error);
    }

    return Result.Ok(
      new Campaign(id, {
        title: props.title,
        description: props.description,
        longDescription: props.longDescription,
        pictures: props.pictures,
        config: config.value,
        active: props.active,
        deleted: false,
      }),
    );
  }

  static from(props: { id: string } & CampaignProps) {
    const id = CampaignId.from(props.id).value;
    const config = CampaignConfig.from(props.config);

    return Result.Ok(
      new Campaign(id, {
        title: props.title,
        description: props.description,
        longDescription: props.longDescription,
        pictures: props.pictures,
        config: config.value,
        active: props.active,
        deleted: props.deleted,
      }),
    );
  }
}
