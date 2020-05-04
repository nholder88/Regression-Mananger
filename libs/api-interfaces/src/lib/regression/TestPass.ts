import { FeatureScenarioContainer, IFeatureScenarioContainer } from './FeatureScenarioContainer';

//This is the listing in the regression that we look at to see the test passes that are done
export interface ITestPass {
     featureScenarioContainers: IFeatureScenarioContainer[],
     creator: string,
     timeStamp: Date,
     isComplete: boolean,
     isStarted: boolean,
  title:string,
     id: string
}


export class TestPass implements ITestPass{
  constructor(
    public featureScenarioContainers: FeatureScenarioContainer[],
    public creator: string,
    public timeStamp: Date,
    public isComplete: boolean,
    public isStarted: boolean,
    public id: string = null,
    public title:string= '',
    public Header:string= null
  ) {}
}
