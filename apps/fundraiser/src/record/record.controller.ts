import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { UserGuard } from '../guards/user.guard';
import { Ctx } from '@common/decorators/context.decorator';
import { Context } from '../types';

@Controller('records')
@UseGuards(UserGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async getRecords(@Ctx() ctx: Context) {
    return this.recordService.findManyOrders({
      userId: ctx.user.id,
    });
  }

  @Get(':orderId')
  async getRecord(@Ctx() ctx: Context, @Param('orderId') orderId: string) {
    return this.recordService.findRecordByOrderId({
      orderId: orderId,
      userId: ctx.user.id,
    });
  }
}
