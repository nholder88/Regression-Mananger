import { ITestPass } from './TestPass';

//Container for the passes and the root object

export interface IRegressionHeader extends BaseModel {
  testPasses: ITestPass[];
  name: string;
  isComplete: boolean;
  isStarted: boolean;
  releaseName: string;
  startDate: Date;
  endDate: Date;
  id: string;
  userId: string;
}
export class RegressionHeader implements IRegressionHeader {
  constructor(
    public testPasses: ITestPass[],
    public name: string,
    public isComplete: boolean = false,
    public isStarted: boolean = false,
    public releaseName: string = '',
    public startDate: Date = new Date(),
    public endDate: Date = new Date()
  ) {}

  id: string;
  userId: string;
}
