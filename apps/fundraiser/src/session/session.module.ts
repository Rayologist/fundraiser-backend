import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { AuthModule } from '../auth/auth.module';
import { UserDomainModule } from '@domains/fundraiser/user/user.module';
import { JWTService } from '../jwt/jwt.service';

@Module({
  imports: [AuthModule, UserDomainModule],
  controllers: [SessionController],
  providers: [SessionService, JWTService],
})
export class SessionModule {}
