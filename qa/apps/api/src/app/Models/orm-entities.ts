import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import {Issue, Regression, RegressionResult, Roles, Test, TestCase, User} from "@qa/api-interfaces";
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDate, IsNumber, IsString} from "class-validator";

@Entity()
export class TestEntity implements Test {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @OneToMany(type => TestCaseEntity, testCase => testCase.test)
  testCases: TestCaseEntity[];

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() role: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() loginUserName: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() name: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() teamOwner: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() feature: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() area: string;

  @ApiProperty()
  @ManyToMany(type => RegressionResultEntity, rr => rr.tests)
  regressionResult: RegressionResultEntity[];
}

@Entity()
export class IssueEntity implements Issue {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;
}
@Entity()
export class TestCaseEntity implements TestCase {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @Column() caseStatus: string;

  @ApiProperty()
  @Column() caseOrder: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() description: string;

  @ApiProperty()
  @ManyToOne(type => TestEntity, test => test.testCases)
  test: TestEntity;
}
@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() team: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column()
  name: string;


  @ApiProperty()
  @ManyToMany(type => RolesEntity, roles => roles.users)
  @JoinTable()
  roles: RolesEntity[];

  @ApiProperty()
  @IsDate()
  @Column({type: "timestamp"}) lastLogin: Date;
}
@Entity()
export class RolesEntity implements Roles {

  @ApiProperty({type: 'number'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({type: 'string'})
  @Column()
  name: string;

  @ApiProperty()
  @ManyToMany(type => UserEntity, user => user.roles)
  users: UserEntity[];
}
@Entity()
export class RegressionEntity implements Regression {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() name: string;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() releaseName: string;

  @ApiProperty()
  @IsDate()
  @Column() actualStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Column() actualEndDate: Date;

  @ApiProperty()
  @IsDate()
  @Column() plannedStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Column() plannedEndDate: Date;

  @ApiProperty()
  @OneToMany(type => RegressionResultEntity, rr => rr.regression)
  results: RegressionResultEntity[];

  @ApiProperty({type: 'boolean'})
  @IsBoolean()
  @Column() isComplete: boolean;
}
@Entity()
export class RegressionResultEntity implements RegressionResult {
  @ApiProperty()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @OneToOne(type => UserEntity)
  @JoinColumn()
  tester: UserEntity;

  @ApiProperty({type: 'boolean'})
  @IsBoolean()
  @Column() isComplete: boolean;

  @ManyToOne(type => RegressionEntity, reg => reg.results)
  regression: RegressionEntity;


  @ManyToMany(type => TestEntity, test => test.regressionResult)
  @JoinTable()
  tests: TestEntity[];
}


