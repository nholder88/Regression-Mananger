import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScenarioResult } from '../database/entities/scenario-result.entity';
import { ScenarioResultService } from './scenario-result.service';
import { ScenarioResultController } from './scenario-result.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScenarioResult])],
  providers: [ScenarioResultService],
  controllers: [ScenarioResultController],
  exports: [ScenarioResultService],
})
export class ScenarioResultModule {}
