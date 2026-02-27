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
import { ImportSession } from './import-session.entity';

@Entity('integration_configs')
export class IntegrationConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column()
  name: string;

  @Column()
  baseUrl: string;

  @Column()
  projectKey: string;

  @Column()
  authMethod: string;

  @Column()
  authToken: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ImportSession, (s) => s.integration)
  importSessions: ImportSession[];
}
