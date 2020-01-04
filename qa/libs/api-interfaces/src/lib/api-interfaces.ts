export interface Message {
  message: string;
}


export interface Issue {
  id: number;
}

export interface Regression {
  id: number;
  name: string;
  releaseName: string;
  actualStartDate: Date;
  actualEndDate: Date;
  plannedStartDate: Date;
  plannedEndDate: Date;
  results: RegressionResult[];
  isComplete: boolean;
  isStarted: boolean;
  practiceName: string;
}

export interface RegressionResult {
  id: number;
  tester: User;
  isComplete: boolean;
  tests: Test[];

}

export interface Test {
  id: number;
  testCases: TestCaseResult[];
  name: string;
  teamOwner: string;
  feature: string;
  area: string;
}

export interface Area {
  id: number;
  name: string;
  features: Feature[]
}

export interface Feature {
  id: number;
  name: string;
  teams: Team[]
  subFeatures: Feature[]
}

export interface Team {
  id: number;
  name: string;
//  Owner: User;

}

export interface TestCase {
  id: number;
  feature: Feature;
  caseOrder: number;
  description: string;
}

export interface TestCaseResult {
  testCase: TestCase
  caseStatus: string;
  testingRole: string;
  testingLoginUserName: string;

}

export interface User {
  id: number;
  team: Team;
  name: string;
  roles: Roles[];
  lastLogin: Date;
}

export interface Roles {

  id: number;
  name: string;
  users: User[];
}
