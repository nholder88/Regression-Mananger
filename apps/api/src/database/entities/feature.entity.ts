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
import { Scenario } from './scenario.entity';
import { TestPass } from './test-pass.entity';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  team: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Scenario, (s) => s.feature, { cascade: true })
  scenarios: Scenario[];

  @ManyToMany(() => TestPass, (t) => t.features)
  testPasses: TestPass[];
}
