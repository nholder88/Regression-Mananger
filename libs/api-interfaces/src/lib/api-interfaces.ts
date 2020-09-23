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
  id: string;
  username: string;
  password: string;
  email: string;
  //role: Role;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}
