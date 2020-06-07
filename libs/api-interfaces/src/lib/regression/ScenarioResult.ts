import { IScenario, ITestPass, Scenario } from '@qa/api-interfaces';

export interface IScenarioResult {
  id: string;
  timestamp: Date;
  completedBy: string;
  status: string;
  notes: string;
  bugCreated: boolean;
  completedSteps: Array<number>;
  //Relationships
  scenario: IScenario;
  testPass: ITestPass;
  userId: string;
}

export class ScenarioResult implements IScenarioResult {
  constructor() {}
  bugCreated: boolean = false;
  completedBy: string = '';
  completedSteps: Array<number> = [];
  id: string = '';
  notes: string = '';
  scenario: Scenario;
  status: string = 'Untested';
  testPass: ITestPass;
  timestamp: Date = new Date();
  userId: string;
}
