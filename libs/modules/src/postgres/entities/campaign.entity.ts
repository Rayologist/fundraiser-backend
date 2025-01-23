import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { DefaultEntity } from '../common/columns';
import { Product } from './product.entity';
import { CampaignConfigProps } from '@domains/fundraiser/campaign/domain/value-objects/campaign-config.value-object';

@Entity('Campaign')
export class Campaign extends DefaultEntity {
  constructor(args?: Partial<Campaign>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'simple-json' })
  config!: CampaignConfigProps;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  longDescription!: string;

  @Column({ type: 'simple-json' })
  pictures!: string[];

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean', default: false })
  deleted!: boolean;

  @OneToMany(() => Product, (product) => product.campaign)
  products?: Relation<Product[]>;
}
