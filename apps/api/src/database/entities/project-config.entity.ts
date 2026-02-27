import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TestFile } from './test-file.entity';
import { AgentRun } from './agent-run.entity';

@Entity('project_configs')
export class ProjectConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  repoUrl: string;

  @Column({ default: '' })
  language: string;

  @Column({ default: '' })
  framework: string;

  @Column({ default: '' })
  testRunner: string;

  @Column({ default: '' })
  testDirectory: string;

  @Column({ default: '' })
  sourceDirectory: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastAnalyzedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  configHash: string | null;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => TestFile, (f) => f.project)
  testFiles: TestFile[];

  @OneToMany(() => AgentRun, (r) => r.project)
  agentRuns: AgentRun[];
}
