import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IntegrationConfig } from './integration-config.entity';
import { User } from './user.entity';

@Entity('import_sessions')
export class ImportSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  integrationId: string;

  @Column()
  query: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 0 })
  importedCount: number;

  @Column({ default: 0 })
  skippedCount: number;

  @Column({ type: 'varchar', nullable: true })
  errorMessage: string | null;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => IntegrationConfig, (i) => i.importSessions)
  @JoinColumn({ name: 'integrationId' })
  integration: IntegrationConfig;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
