import { Scenario } from './scenario';
///These can be accordion headers
/// These are created based on the features selected in wizard on the server this logic is hidden from UI
export class FeatureScenarioContainer {
  constructor(public feature: string, public scenarios: Scenario[]) {}
}