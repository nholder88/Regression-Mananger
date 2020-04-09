import { TestPass } from './TestPass';
//Container for the passes and the root object
export class RegressionTesting {
  constructor(public testPasses: TestPass[], public name: string) {}
}
