import { ISteps, Steps } from './Steps';

export interface IScenario {
  //feature: string,
  name: string,
  steps: ISteps[],
  timestamp: Date,
  note: string,
  order: number,
  id: string,

}

export class Scenario implements IScenario {
  constructor(
    public feature: string,
    public name: string,
    public result: boolean = false,
    public steps: Steps[] = [],
    public timestamp: Date = new Date(),
    public note: string = '',
    public order: number = 0,
    public id: string = ''
  ) {
  }
}
