import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Scenario } from './scenario.entity';

@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  order: number;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  scenarioId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Scenario, (s) => s.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scenarioId' })
  scenario: Scenario;
}
