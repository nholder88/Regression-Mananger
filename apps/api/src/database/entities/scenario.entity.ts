import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Feature } from './feature.entity';
import { Step } from './step.entity';
import { ScenarioResult } from './scenario-result.entity';

@Entity('scenarios')
export class Scenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  note: string;

  @Column('int', { default: 0 })
  order: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  featureId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Feature, (f) => f.scenarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'featureId' })
  feature: Feature;

  @OneToMany(() => Step, (s) => s.scenario, { cascade: true })
  steps: Step[];

  @OneToMany(() => ScenarioResult, (r) => r.scenario)
  scenarioResults: ScenarioResult[];
}
