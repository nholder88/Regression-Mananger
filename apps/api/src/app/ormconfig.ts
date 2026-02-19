import { ConnectionOptions, getMetadataArgsStorage } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: +(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? 'root',
  password: process.env.POSTGRES_PASSWORD ?? 'root',
  database: process.env.POSTGRES_DB ?? 'dev',
  entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
  migrationsTableName: "migrations_log",
  migrationsRun: true,
  logging: true,
  logger: 'file',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'apps/api/src/app/migrations',
  },
};
export = config;





