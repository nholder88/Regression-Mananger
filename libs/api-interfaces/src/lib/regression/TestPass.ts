import { FeatureScenarioContainer, IFeatureScenarioContainer } from './FeatureScenarioContainer';
import { IScenarioResult } from './ScenarioResult';
import { IRegressionHeader } from './RegressionHeader';

//This is the listing in the regression that we look at to see the test passes that are done
export interface ITestPass {
  featureScenarioContainers: IFeatureScenarioContainer[];
  creator: string;
  timeStamp: Date;
  isComplete: boolean;
  isStarted: boolean;
  title: string;
  id: string;
  testingRole: string;
  testingLoginUserName: string;
}

export class TestPass implements ITestPass {
  results: IScenarioResult[];
  constructor(
    public featureScenarioContainers: FeatureScenarioContainer[],
    public creator: string,
    public timeStamp: Date,
    public isComplete: boolean,
    public isStarted: boolean,
    public id: string = null,
    public title: string = '',
    public Header: IRegressionHeader = null,
    public testingLoginUserName: string=null,
  public  testingRole: string=null
  ) {}


}
