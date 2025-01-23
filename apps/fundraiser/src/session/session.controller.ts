import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { UserGuard } from '../guards/user.guard';
import { Ctx } from '@common/decorators/context.decorator';
import { Context } from '../types';

@UseGuards(UserGuard)
@Controller('session')
export class SessionController {
  constructor(private readonly _sessionService: SessionService) {}

  @Get()
  getSession(@Ctx() ctx: Context) {
    return {
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
      email: ctx.user.email,
      picture: ctx.user.picture,
    };
  }

  @Delete()
  async deleteSession(@Ctx() ctx: Context, @Res() res: Response) {
    await this._sessionService.deleteSession(ctx.user.id);
    res.clearCookie('tk').sendStatus(HttpStatus.OK);
  }
}
