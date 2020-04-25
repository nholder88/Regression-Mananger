import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';

import { RegressionTestingEntity } from '../Models/regression-orm.model';

@Module({
  imports: [TypeOrmModule.forFeature([RegressionTestingEntity])],
  providers: [RegressionService],
  controllers: [RegressionController]
})
export class RegressionModule {}
