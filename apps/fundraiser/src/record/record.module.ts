import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { OrderRecordPresenter } from './presenters/order-record.presenter';
import { JWTService } from '../jwt/jwt.service';
import { OrderDetailsPresenter } from './presenters/order-details.presenter';

@Module({
  controllers: [RecordController],
  providers: [
    RecordService,
    OrderRecordPresenter,
    OrderDetailsPresenter,
    JWTService,
  ],
})
export class RecordModule {}
