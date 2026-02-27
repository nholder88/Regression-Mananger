import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Scenario } from './scenario.entity';
import { TestPass } from './test-pass.entity';

@Entity('scenario_results')
@Unique(['scenarioId', 'testPassId'])
export class ScenarioResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column({ default: '' })
  notes: string;

  @Column({ default: false })
  bugCreated: boolean;

  @Column({ type: 'varchar', nullable: true })
  bugTicketId: string | null;

  @Column({ default: '' })
  completedBy: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column('jsonb', { default: '[]' })
  completedSteps: number[];

  @Column('uuid')
  userId: string;

  @Column('uuid')
  scenarioId: string;

  @Column('uuid')
  testPassId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Scenario, (s) => s.scenarioResults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scenarioId' })
  scenario: Scenario;

  @ManyToOne(() => TestPass, (t) => t.scenarioResults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testPassId' })
  testPass: TestPass;
}
