import { Entity, Column, ObjectIdColumn } from 'typeorm';



@Entity()
export class Issue {
  @ObjectIdColumn()
  id: number;
}

@Entity()
export class TestCase {
  @ObjectIdColumn()
  id: number;

  @Column()
  caseStatus: Status;
  @Column()
  caseOrder: number;
  @Column()
  description: string;
}
@Entity()
export class User {
  @ObjectIdColumn()
  id: number;
  @Column()
  team: string;
  @Column()
  name: string;

}
@Entity()
export class Test {
  @ObjectIdColumn()
  id: number;
  @Column(type => TestCase)
  testCases: TestCase[];
  @Column()
  role: string;
  @Column()
  loginUserName: string;
  @Column()
  name: string;
  @Column()
  teamOwner: string;
  @Column()
  feature: string;
  @Column()
  area: string;
}
export enum Status {
  Failed = 'Failed',
  Passed = 'Passed',
  UnTested = 'Un-Tested',
  Blocked = 'Blocked',
  Skipped = 'Skipped'
}
@Entity()
export class RegressionResult {
  @ObjectIdColumn()
  id: number;

  @Column(type => User)
  tester: User;

  @Column()
  isComplete: boolean;

  @Column(type => Test)
  tests: Test[];
}

@Entity()
export class Regression {
  @ObjectIdColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  releaseName: string;

  @Column()
  actualStartDate: Date;
  @Column()
  actualEndDate: Date;
  @Column()
  plannedStartDate: Date;
  @Column()
  plannedEndDate: Date;

  @Column(type => RegressionResult)
  results: RegressionResult[];

  @Column()
  isComplete: boolean;
}

