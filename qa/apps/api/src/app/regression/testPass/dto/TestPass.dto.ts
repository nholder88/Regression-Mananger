import { FeatureScenarioContainer, IFeatureScenarioContainer, ITestPass } from '@qa/api-interfaces';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

import { RegressionHeaderDto } from '../../../Models/regression-header.dto';
import { FeatureDto } from '../../../Models/feature.dto';


@Entity()
export class TestPassDto implements ITestPass{

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  creator: string;


  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
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

  // Header is attached to this model there is one header per test pass.
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @ManyToOne(type=> RegressionHeaderDto, header => header.TestPasses)
Header: RegressionHeaderDto;

  @ManyToMany(type => FeatureDto)
  @JoinTable()
  // There are multiple feature-scenarios tied to each test pass.
  featureScenarioContainers: FeatureDto[];

}
