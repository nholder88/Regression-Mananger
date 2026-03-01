import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenario } from '../database/entities/scenario.entity';
import { Step } from '../database/entities/step.entity';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scenario, Step])],
  providers: [ScenarioService],
  controllers: [ScenarioController],
  exports: [ScenarioService],
})
export class ScenarioModule {}
