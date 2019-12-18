import {Column, Entity, ObjectIdColumn} from "typeorm";
import {Issue, Regression, RegressionResult, Status, Test, TestCase, User} from "@qa/api-interfaces";


@Entity()
export class IssueEntity implements Issue {
  @ObjectIdColumn() id: number;
}

@Entity()
export class TestCaseEntity implements TestCase {
  @ObjectIdColumn() id: number;

  @Column() caseStatus: Status;
  @Column() caseOrder: number;
  @Column() description: string;
}

@Entity()
export class UserEntity implements User {
  @ObjectIdColumn() id: number;
  @Column() team: string;

  @Column() name: string;
  @Column() roles: string[];
  @Column() lastLogin: Date;
}

@Entity()
export class TestEntity implements Test {
  @ObjectIdColumn() id: number;
  @Column(type => TestCaseEntity) testCases: TestCaseEntity[];
  @Column() role: string;
  @Column() loginUserName: string;
  @Column() name: string;
  @Column() teamOwner: string;
  @Column() feature: string;
  @Column() area: string;
}

@Entity()
export class RegressionEntity implements Regression {
  @ObjectIdColumn() id: number;

  @Column() name: string;

  @Column() releaseName: string;

  @Column() actualStartDate: Date;
  @Column() actualEndDate: Date;
  @Column() plannedStartDate: Date;
  @Column() plannedEndDate: Date;

  @Column(type => RegressionResultEntity) results: RegressionResult[];

  @Column() isComplete: boolean;
}

@Entity()
export class RegressionResultEntity implements RegressionResult {
  @ObjectIdColumn() id: number;

  @Column(type => UserEntity) tester: User;

  @Column() isComplete: boolean;

  @Column(type => TestEntity) tests: Test[];
}
