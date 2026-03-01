import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { HeaderModule } from './header/header.module';
import { FeatureModule } from './feature/feature.module';
import { StepModule } from './step/step.module';
import { ScenarioModule } from './scenario/scenario.module';
import { ScenarioResultModule } from './scenario-result/scenario-result.module';
import { UserModule } from './user/user.module';
import { TestPassModule } from './test-pass/test-pass.module';
import { IntegrationModule } from './integration/integration.module';
import { ProjectModule } from './project/project.module';
import { TestFileModule } from './test-file/test-file.module';
import { AgentRunModule } from './agent-run/agent-run.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 240000, limit: 100 }]),
    DatabaseModule,
    SeedModule,
    AuthModule,
    HeaderModule,
    FeatureModule,
    StepModule,
    ScenarioModule,
    ScenarioResultModule,
    UserModule,
    TestPassModule,
    IntegrationModule,
    ProjectModule,
    TestFileModule,
    AgentRunModule,
    ImportModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
