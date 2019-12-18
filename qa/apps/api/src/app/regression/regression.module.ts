import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';

import {RegressionEntity} from "../Models/orm-entities";

@Module({
  imports: [TypeOrmModule.forFeature([RegressionEntity])],
  providers: [ RegressionService],
  controllers: [ RegressionController],
})
export class RegressionModule {}
