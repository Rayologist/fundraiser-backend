import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { repositories } from './repositories';
import { env } from '@common/environments/fundraiser.env';

const entityClassOrSchema = [...entities];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.postgresHost,
      port: env.postgresPort,
      username: env.postgresUser,
      password: env.postgresPassword,
      database: env.postgresDb,
      entities: entityClassOrSchema,
    }),
    TypeOrmModule.forFeature(entityClassOrSchema),
  ],
  providers: [...repositories],
  exports: [TypeOrmModule, ...repositories],
})
export class PostgresModule {}
