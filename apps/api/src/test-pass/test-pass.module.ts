import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestPass } from '../database/entities/test-pass.entity';
import { Feature } from '../database/entities/feature.entity';
import { Scenario } from '../database/entities/scenario.entity';
import { ScenarioResult } from '../database/entities/scenario-result.entity';
import { TestPassService } from './test-pass.service';
import { TestPassController } from './test-pass.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestPass, Feature, Scenario, ScenarioResult]),
  ],
  providers: [TestPassService],
  controllers: [TestPassController],
  exports: [TestPassService],
})
export class TestPassModule {}
