import { FeatureScenarioContainer } from './FeatureScenarioContainer';
//This is the listing in the regression that we look at to see the test passes that are done
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
