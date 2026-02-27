import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegressionHeader } from './entities/regression-header.entity';
import { Feature } from './entities/feature.entity';
import { Scenario } from './entities/scenario.entity';
import { Step } from './entities/step.entity';
import { TestPass } from './entities/test-pass.entity';
import { ScenarioResult } from './entities/scenario-result.entity';
import { IntegrationConfig } from './entities/integration-config.entity';
import { ImportSession } from './entities/import-session.entity';
import { ProjectConfig } from './entities/project-config.entity';
import { TestFile } from './entities/test-file.entity';
import { AgentRun } from './entities/agent-run.entity';

const entities = [
  User,
  RegressionHeader,
  Feature,
  Scenario,
  Step,
  TestPass,
  ScenarioResult,
  IntegrationConfig,
  ImportSession,
  ProjectConfig,
  TestFile,
  AgentRun,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['POSTGRES_HOST'] || 'localhost',
      port: parseInt(process.env['POSTGRES_PORT'] || '5432', 10),
      username: process.env['POSTGRES_USER'] || 'root',
      password: process.env['POSTGRES_PASSWORD'] || 'root',
      database: process.env['POSTGRES_DB'] || 'dev',
      entities,
      synchronize: process.env['NODE_ENV'] !== 'production',
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
