


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
}

export interface RegressionResult {
  id: number;
  tester: User;
  isComplete: boolean;
  tests: Test[];

}
export interface Test {
  id: number;
  testCases: TestCase[];
  role: string;
  loginUserName: string;
  name: string;
  teamOwner: string;
  feature: string;
  area: string;
}

export interface TestCase {
  id: number;
  caseStatus: string;
  caseOrder: number;
  description: string;
}
export interface User {
  id: number;
  team: string;
  name: string;
  roles: Roles[];
  lastLogin: Date;
}

export interface Roles{

  id:number;
  name:string;
  users: User[];
}
