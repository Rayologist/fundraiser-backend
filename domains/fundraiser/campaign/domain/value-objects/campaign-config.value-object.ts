import { Result, ValueObject } from '@common/ddd';

export type CampaignConfigVOProps = {
  color: {
    primary: string;
    secondary: string;
  };
};

export type CampaignConfigProps = {
  color: {
    primary: string;
    secondary: string;
  };
};

export class CampaignConfig extends ValueObject<CampaignConfigVOProps> {
  get value() {
    return this.props;
  }

  get color() {
    return this.props.color;
  }

  private static createDefaultConfig() {
    return {
      color: {
        primary: '#64d2ff',
        secondary: '#caf2ff',
      },
    };
  }

  static create(props: CampaignConfigProps | null) {
    if (!props) {
      return Result.Ok(new CampaignConfig(this.createDefaultConfig()));
    }

    return Result.Ok(new CampaignConfig(props));
  }

  static from(props: CampaignConfigProps) {
    return Result.Ok(new CampaignConfig(props));
  }
}
