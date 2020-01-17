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
import {
  Area,
  Feature,
  Issue,
  Regression,

  Roles,
  Team,
  Test,
  TestCase, TestCaseResult,
  User
} from "@qa/api-interfaces";
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDate, IsNumber, IsString} from "class-validator";

@Entity()
export class TeamEntity implements Team {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({type: 'string'})
  @IsString()
  @Column() name: string;

  @ManyToMany(type => FeatureEntity, rr => rr.teams)
  features: FeatureEntity[];

  @ManyToOne(type => UserEntity, reg => reg.team)
  users: UserEntity[];
}

@Entity()
export class AreaEntity implements Area {
  @PrimaryGeneratedColumn() id: number;
  @ApiProperty({type: 'string'})
  @IsString()
  @Column() name: string;
  @OneToMany(type => FeatureEntity, featureEntity => featureEntity.area)
  features: Feature[];
}

@Entity()
export class FeatureEntity implements Feature {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() name: string;

  @Column() enable: boolean;

  @ManyToMany(type => FeatureEntity, category => category.manyInverseFeatures, {
    cascade: true
  })
  @JoinTable()
  subFeatures: FeatureEntity[];

  @ManyToMany(type => FeatureEntity, category => category.subFeatures, {
    cascade: true
  })
  manyInverseFeatures: FeatureEntity[];


  @ManyToMany(type => TeamEntity, rr => rr.features)
  teams: TeamEntity[];
  @ManyToOne(type => AreaEntity, test => test.features)
  area: AreaEntity;

  @OneToMany(type => TestCaseEntity, testCase => testCase.feature) // note: we will create author property in the Photo class below
  cases: TestCaseEntity[];

}

export class TestCaseResultEntity implements TestCaseResult {
  @PrimaryGeneratedColumn() id: number;
  @Column() caseStatus: string;
  @OneToMany(type => TestCaseEntity, testCase => testCase.tests)
  testCase: TestCaseEntity;
  @Column() testingLoginUserName: string;
  @Column() testingRole: string;

}

@Entity()
export class TestEntity implements Test {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @OneToMany(type => TestCaseResultEntity, testCase => testCase.testCase)
  testCases: TestCaseResultEntity[];

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
  @Column() isComplete: boolean;
  @ManyToOne(type => UserEntity, author => author.tests)
  tester: UserEntity;

  @ManyToOne(type => RegressionEntity, author => author.results)
  regression: RegressionEntity;


}

@Entity()
export class IssueEntity implements Issue {
  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;
}

@Entity()
export class TestCaseEntity implements TestCase {
  @ManyToOne(type => FeatureEntity, featureEntity => featureEntity.cases)
  feature: FeatureEntity;

  @ApiProperty({type: 'number'})
  @IsNumber()
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @Column() caseOrder: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() description: string;
  @OneToMany(type => TestCaseResultEntity, testCaseResult => testCaseResult.testCase) // note: we will create author property in the Photo class below
  tests: TestCaseResultEntity[];
}


@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column()
  @ManyToOne(type => TeamEntity, reg => reg.users)
  team: TeamEntity;

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

  @OneToMany(type => TestEntity, photo => photo.tester) // note: we will create author property in the Photo class below
  tests: TestEntity[];
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
  @OneToMany(type => TestEntity, rr => rr.regression)
  results: TestEntity[];

  @ApiProperty({type: 'boolean'})
  @IsBoolean()
  @Column() isComplete: boolean;

  @ApiProperty({type: 'boolean'})
  @IsBoolean()
  @Column() isStarted: boolean;

  @ApiProperty({type: 'string'})
  @IsString()
  @Column() practiceName: string;
}
