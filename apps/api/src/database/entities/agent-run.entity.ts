import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectConfig } from './project-config.entity';
import { User } from './user.entity';

@Entity('agent_runs')
export class AgentRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @Column()
  command: string;

  @Column({ default: 'running' })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ default: '' })
  summary: string;

  @Column({ type: 'varchar', nullable: true })
  errorMessage: string | null;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => ProjectConfig, (p) => p.agentRuns)
  @JoinColumn({ name: 'projectId' })
  project: ProjectConfig;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
