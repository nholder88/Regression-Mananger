import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RegressionHeader } from './regression-header.entity';
import { Feature } from './feature.entity';
import { Scenario } from './scenario.entity';
import { Step } from './step.entity';
import { TestPass } from './test-pass.entity';
import { ScenarioResult } from './scenario-result.entity';
import { IntegrationConfig } from './integration-config.entity';
import { ProjectConfig } from './project-config.entity';
import { AgentRun } from './agent-run.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RegressionHeader, (h) => h.user)
  regressionHeaders: RegressionHeader[];

  @OneToMany(() => Feature, (f) => f.user)
  features: Feature[];

  @OneToMany(() => Scenario, (s) => s.user)
  scenarios: Scenario[];

  @OneToMany(() => Step, (s) => s.user)
  steps: Step[];

  @OneToMany(() => TestPass, (t) => t.user)
  testPasses: TestPass[];

  @OneToMany(() => ScenarioResult, (r) => r.user)
  scenarioResults: ScenarioResult[];

  @OneToMany(() => IntegrationConfig, (i) => i.user)
  integrationConfigs: IntegrationConfig[];

  @OneToMany(() => ProjectConfig, (p) => p.user)
  projectConfigs: ProjectConfig[];

  @OneToMany(() => AgentRun, (a) => a.user)
  agentRuns: AgentRun[];
}
