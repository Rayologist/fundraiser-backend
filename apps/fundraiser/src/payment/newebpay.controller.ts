import { env } from '@common/environments/fundraiser.env';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

const paymentRedirectUrl = `${env.clientUrl}/records`;

@Controller('payment/newebpay')
export class NewebpayController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('redirect')
  async postRedirect(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentService.redirect(body);
    res.redirect(`${env.clientUrl}/${result}`);
  }

  @Get('redirect')
  @Redirect(paymentRedirectUrl)
  async getRedirect() {}

  @Post('confirm')
  @HttpCode(200)
  async confirm(@Body() body: any) {
    return this.paymentService.confirm(body);
  }
}
