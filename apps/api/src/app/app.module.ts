import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionModule } from './regression/regression.module';

import { getMetadataArgsStorage } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.SQL_INSTANCE ?? 'localhost',
     port: +process.env.SQL_INSTANCE_PORT ?? 1433,
     username: process.env.SQL_INSTANCE_USER ?? 'root',
      password: process.env.SQL_INSTANCE_PASSWORD ?? 'root',
      database: process.env.SQL_INSTANCE_DBNAME ?? 'dev',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      cli:{migrationsDir: "src/migration"}

    }),
    RegressionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}

