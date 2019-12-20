import {Column, Entity, ObjectIdColumn} from "typeorm";
import {Issue, Regression, RegressionResult, Status, Test, TestCase, User} from "@qa/api-interfaces";
import {IsBoolean, IsDate, IsNumber, IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import {isDate} from "util";


@Entity()
export class IssueEntity implements Issue {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ObjectIdColumn() id: number;
}

@Entity()
export class TestCaseEntity implements TestCase {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ObjectIdColumn() id: number;

  @Column() caseStatus: Status;

  @Column() caseOrder: number;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() description: string;
}

@Entity()
export class UserEntity implements User {
  @ObjectIdColumn() id: number;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() team: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() name: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() roles: string[];
  @ApiProperty({ type: 'date' })
  @IsDate()
  @Column() lastLogin: Date;
}

@Entity()
export class TestEntity implements Test {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ObjectIdColumn() id: number;
  @Column(type => TestCaseEntity) testCases: TestCaseEntity[];
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() role: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() loginUserName: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() name: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() teamOwner: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() feature: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() area: string;
}

@Entity()
export class RegressionEntity implements Regression {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ObjectIdColumn() id: number;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() name: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column() releaseName: string;
  @ApiProperty({ type: 'date' })
  @IsDate()
  @Column() actualStartDate: Date;
  @ApiProperty({ type: 'date' })
  @IsDate()
  @Column() actualEndDate: Date;
  @ApiProperty({ type: 'date' })
  @IsDate()
  @Column() plannedStartDate: Date;
  @ApiProperty({ type: 'date' })
  @IsDate()
  @Column() plannedEndDate: Date;

  @Column(type => RegressionResultEntity) results: RegressionResult[];
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column() isComplete: boolean;
}

@Entity()
export class RegressionResultEntity implements RegressionResult {
  @ObjectIdColumn() id: number;

  @Column(type => UserEntity) tester: User;
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column() isComplete: boolean;

  @Column(type => TestEntity) tests: Test[];
}
