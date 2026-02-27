import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectConfig } from './project-config.entity';
import { Scenario } from './scenario.entity';

@Entity('test_files')
export class TestFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @Column('uuid', { nullable: true })
  scenarioId: string | null;

  @Column()
  filePath: string;

  @Column()
  testType: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncedAt: Date | null;

  @Column({ default: 'synced' })
  syncStatus: string;

  @Column({ default: '' })
  contentHash: string;

  @ManyToOne(() => ProjectConfig, (p) => p.testFiles)
  @JoinColumn({ name: 'projectId' })
  project: ProjectConfig;

  @ManyToOne(() => Scenario)
  @JoinColumn({ name: 'scenarioId' })
  scenario: Scenario | null;
}
