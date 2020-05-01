import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionModule } from './regression/regression.module';

import { getMetadataArgsStorage } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_INSTANCE ?? 'localhost',
      port: +process.env.MYSQL_INSTANCE_PORT ?? 3306,
      username: process.env.MYSQL_INSTANCE_USER ?? 'root',
      password: process.env.MYSQL_INSTANCE_PASSWORD ?? 'root',
      database: process.env.MYSQL_INSTANCE_DBNAME ?? 'dev',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true
    }),
    RegressionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
