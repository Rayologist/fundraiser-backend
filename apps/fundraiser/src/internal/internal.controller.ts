import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InternalService } from './internal.service';
import { InternalGuard } from '../guards/internal.guard';
import { SendReceiptDto } from './dtos/receipt.dto';

@Controller('internal')
@UseGuards(InternalGuard)
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('init')
  async init() {
    await this.internalService.init();
  }

  @Post('test-receipt')
  async testReceipt(@Body() body: SendReceiptDto) {
    await this.internalService.sendReceipt({
      to: body.to,
    });
  }
}