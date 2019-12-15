import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionEntity } from '@qa/api-interfaces';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';
import {Repository} from "typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([RegressionEntity])],
  providers: [ RegressionService],
  controllers: [ RegressionController],
})
export class RegressionModule {}
