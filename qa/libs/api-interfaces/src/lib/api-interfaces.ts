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
  results: Test[];
  isComplete: boolean;
  isStarted: boolean;
  practiceName: string;
}

export interface Test {
  id: number;
  testCases: TestCaseResult[];
  tester: User;
  isComplete: boolean;
}

export interface Area {
  id: number;
  name: string;
  features: Feature[];
}

export interface Feature {
  id: number;
  name: string;
  teams: Team[];
  subFeatures: Feature[];
  enable: boolean;
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
  id: number;
  testCase: TestCase;
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
