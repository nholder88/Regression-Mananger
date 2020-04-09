import { FeatureScenarioContainer } from './FeatureScenarioContainer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'; //This is the listing in the regression that we look at to see the test passes that are done
export class TestPass {
  constructor(
    public featureScenarioContainers: FeatureScenarioContainer[],
    public creator: string,
    public timeStamp: Date,
    public isComplete: boolean,
    public isStarted: boolean,
    public id: string = ''
  ) {}
}
