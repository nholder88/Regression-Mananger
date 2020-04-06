export class Scenario {
  constructor(
    public feature: string,
    public name: string,
    public result: boolean = false,
    public steps: Steps[] = [],
    public timestamp: Date = new Date(),
    public note: string = '',
    public order: number = 0,
    public id: string = ''
  ) {}
}

/// This is a listing inside of scenario just for info
export class Steps {
  constructor(public name: string, public order: number) {}
}

///These can be accordion headers
/// These are created based on the features selected in wizard on the server this logic is hidden from UI
export class FeatureScenarioContainer {
  constructor(public feature: string, public scenarios: Scenario[]) {}
}

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
//Container for the passes and the root object
export class RegressionTesting {
  constructor(public testPasses: TestPass[], public name: string) {}
}
