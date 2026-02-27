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
import { TestPass } from './test-pass.entity';

@Entity('regression_headers')
export class RegressionHeader {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  releaseName: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Date;

  @Column({ default: false })
  isComplete: boolean;

  @Column({ default: false })
  isStarted: boolean;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => TestPass, (t) => t.header, { cascade: true })
  testPasses: TestPass[];
}
