import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InitService } from './init.service';
import { env } from '@common/environments/fundraiser.env';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) {}

  @Post()
  async init(@Body() body: { adminToken: string }) {
    if (body.adminToken !== env.adminToken) {
      throw new UnauthorizedException('Invalid admin token');
    }

    await this.initService.init();
  }
}
