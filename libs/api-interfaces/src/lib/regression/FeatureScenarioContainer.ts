import { IScenario, Scenario } from './scenario';
///These can be accordion headers
/// These are created based on the features selected in wizard on the server this logic is hidden from UI

export interface IFeatureScenarioContainer extends BaseModel {
  id: string;
  name: string;
  team: string;
  scenarios: IScenario[];
  userId: string;
}

export class FeatureScenarioContainer implements IFeatureScenarioContainer {
  constructor(
    public name: string,
    public scenarios: Scenario[],
    public id: string = null
  ) {}
  public enable: boolean;

  team: string;
  userId: string;
}
