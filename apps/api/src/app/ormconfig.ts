import { ConnectionOptions, getMetadataArgsStorage } from 'typeorm';

// You can load you .env file here synchronously using dotenv package (not installed here),

// import * as fs from 'fs';
// const environment = process.env.NODE_ENV || 'development';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...


// Check typeORM documentation for more information.
   const config: ConnectionOptions = {
  type: 'mssql',
  host: process.env.SQL_INSTANCE ?? 'localhost',
  port: +process.env.SQL_INSTANCE_PORT ?? 1433,
  username: process.env.SQL_INSTANCE_USER ?? 'root',
  password: process.env.SQL_INSTANCE_PASSWORD ?? 'root',
  database: process.env.SQL_INSTANCE_DBNAME ?? 'dev4',
     entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
  migrationsTableName: "migrations_log",

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'apps/api/src/app/migrations',
  },
};
export = config;





