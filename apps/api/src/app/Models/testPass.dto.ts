import { ITestPass } from '@qa/api-interfaces';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

import { RegressionHeaderDto } from './regression-header.dto';
import { FeatureDto } from './feature.dto';
import { ScenarioResultDto } from './scenarioResult';
import { UserDto } from './User.Dto';

@Entity()
export class TestPassDto implements ITestPass {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  creator: string;

  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isComplete: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isStarted: boolean;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  timeStamp: Date;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  title: string;

  // Header is attached to this model there is one header per test pass.
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ManyToOne('RegressionHeaderDto', 'testPasses')
  Header: RegressionHeaderDto;

  @ManyToMany('FeatureDto')
  @JoinTable()
  // There are multiple feature-scenarios tied to each test pass.
  featureScenarioContainers: FeatureDto[];

  @OneToMany('ScenarioResultDto', 'testPass')
  results: ScenarioResultDto[];

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column({ default: '' })
  testingLoginUserName: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column({ default: '' })
  testingRole: string;

  @Column({ nullable: true })
  userId: string;
  @OneToOne('UserDto')
  @JoinColumn()
  user: UserDto;
}
