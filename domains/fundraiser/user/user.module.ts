import { Module } from '@nestjs/common';
import {
  UserDomain,
  UserDomainRepository,
} from './infrastructure/user.repository';
import { PostgresModule } from '@modules/postgres/postgres.module';
import { CreateUserUseCase } from './application/create-user/create-user.use-case';
import { FindUserUseCase } from './application/find-user/find-user.use-case';
import { UpdateRefreshTokenUseCase } from './application/update-refresh-token/update-refresh-token.use-case';

const useCases = [
  CreateUserUseCase,
  FindUserUseCase,
  UpdateRefreshTokenUseCase,
];

@Module({
  imports: [PostgresModule],
  providers: [
    {
      provide: UserDomain.Repository,
      useClass: UserDomainRepository,
    },
    ...useCases,
  ],
  exports: [...useCases],
})
export class UserDomainModule {}
