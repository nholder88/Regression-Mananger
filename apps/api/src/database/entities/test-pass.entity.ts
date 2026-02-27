import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { RegressionHeader } from './regression-header.entity';
import { Feature } from './feature.entity';
import { ScenarioResult } from './scenario-result.entity';

@Entity('test_passes')
export class TestPass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '' })
  testingLoginUserName: string;

  @Column({ default: '' })
  testingRole: string;

  @Column({ default: false })
  isComplete: boolean;

  @Column({ default: false })
  isStarted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timeStamp: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  headerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => RegressionHeader, (h) => h.testPasses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'headerId' })
  header: RegressionHeader;

  @ManyToMany(() => Feature, (f) => f.testPasses, { cascade: true })
  @JoinTable({
    name: 'test_pass_features',
    joinColumn: { name: 'testPassId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'featureId', referencedColumnName: 'id' },
  })
  features: Feature[];

  @OneToMany(() => ScenarioResult, (r) => r.testPass, { cascade: true })
  scenarioResults: ScenarioResult[];
}
