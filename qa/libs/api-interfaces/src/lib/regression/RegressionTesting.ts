import { TestPass } from './TestPass';
//Container for the passes and the root object
export class Regression {
  constructor(
    public testPasses: TestPass[],
    public name: string,
    public isComplete: boolean = false,
    public isStarted: boolean = false,
    public releaseName: string = '',
    public startDate: Date = new Date(),
    public endDate: Date = new Date()
  ) {}
  id: string;
}
