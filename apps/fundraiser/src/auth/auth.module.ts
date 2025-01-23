import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDomainModule } from '@domains/fundraiser/user/user.module';
import { JWTService } from '../jwt/jwt.service';

@Module({
  imports: [UserDomainModule],
  controllers: [AuthController],
  providers: [AuthService, JWTService],
})
export class AuthModule {}
