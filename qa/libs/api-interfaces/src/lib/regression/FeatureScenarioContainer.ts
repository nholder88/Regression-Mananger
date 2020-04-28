import { IScenario, Scenario } from './scenario';
///These can be accordion headers
/// These are created based on the features selected in wizard on the server this logic is hidden from UI

export interface IFeatureScenarioContainer {
  id: string,
  feature: string,
  team: string,
  scenarios: IScenario[]
}

export class FeatureScenarioContainer implements IFeatureScenarioContainer {
  constructor(public feature: string, public scenarios: Scenario[]) {
  }

  id: string;
  team: string;
}

