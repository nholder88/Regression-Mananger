import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionHeaderController } from './header/regressionHeader.controller';
import { RegressionHeaderService } from './header/regression-header.service';
import { RegressionHeaderDto } from '../Models/regression-header.dto';
import { TestPassController } from './testPass/testPass.controller';
import { TestPassDto } from '../Models/testPass.dto';
import { TestPassService } from './testPass/testPass.service';
import { FeatureDto } from '../Models/feature.dto';
import { ScenarioDto } from '../Models/scenario.dto';
import { StepDto } from '../Models/step.dto';
import { StepService } from './step/step.service';
import { ScenarioService } from './scenario/scenario.service';
import { FeatureService } from './feature/feature.service';
import { StepController } from './step/step.controller';
import { ScenarioController } from './scenario/scenario.controller';
import { FeatureController } from './feature/feature.controller';
import { ScenarioResultDto } from '../Models/scenarioResult.dto';
import { ScenarioResultService } from './scenarioResult/scenarioResult.service';
import { ScenarioResultController } from './scenarioResult/scenarioResult.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegressionHeaderDto,
      TestPassDto,
      FeatureDto,
      ScenarioDto,
      StepDto,
      ScenarioResultDto
    ])
  ],
  providers: [
    RegressionHeaderService,
    TestPassService,
    StepService,
    ScenarioService,
    FeatureService,
    ScenarioResultService
  ],
  controllers: [
    RegressionHeaderController,
    TestPassController,
    StepController,
    ScenarioController,
    FeatureController,
    ScenarioResultController
  ]
})
export class RegressionModule {}
