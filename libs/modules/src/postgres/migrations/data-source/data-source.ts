import { DataSource } from 'typeorm';
import { env } from '@common/environments/fundraiser.env';

const dataSource = new DataSource({
  type: 'postgres',
  host: env.postgresHost,
  port: env.postgresPort,
  username: env.postgresUser,
  password: env.postgresPassword,
  database: env.postgresDb,
  entities: ['./libs/modules/src/postgres/entities/**/*.ts'],
  migrationsTableName: '_Migrations',
  migrations: ['./libs/modules/src/postgres/migrations/*.ts'],
});

export default dataSource;
