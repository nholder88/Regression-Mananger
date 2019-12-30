import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import {RegressionModule} from "./regression/regression.module";
import {
  IssueEntity,
  RegressionEntity, RegressionResultEntity,
  RolesEntity,
  TestCaseEntity,
  TestEntity,
  UserEntity
} from "./Models/orm-entities";


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [RegressionEntity,UserEntity,RolesEntity,TestEntity,IssueEntity,TestCaseEntity,RegressionResultEntity],
    synchronize: true,
  }), RegressionModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
