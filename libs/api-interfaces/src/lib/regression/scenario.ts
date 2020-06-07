import { ISteps, Steps } from './Steps';
import { IFeatureScenarioContainer } from './FeatureScenarioContainer';

export interface IScenario {
  //feature: string,
  name: string;
  steps: ISteps[];
  timestamp: Date;
  note: string;
  order: number;
  id: string;
  userId: string;
}

export class Scenario implements IScenario {
  enable: boolean = false;
  constructor(
    public feature: IFeatureScenarioContainer,
    public name: string,
    public result: boolean = false,
    public steps: Steps[] = [],
    public timestamp: Date = new Date(),
    public note: string = '',
    public order: number = 0,
    public id: string = ''
  ) {}

  userId: string;
}
