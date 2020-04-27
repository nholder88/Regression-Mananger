import { FeatureScenarioContainer, ITestPass } from '@qa/api-interfaces';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

import { RegressionHeaderDto } from '../../../Models/regression-header.dto';

@Entity()
export class TestPassDto implements ITestPass{

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  creator: string;


  @ApiProperty({ type: 'number' })
  @IsNumber()
  @PrimaryGeneratedColumn()
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
  // There are multiple feature-scenarios tied to each test pass.
  featureScenarioContainers: FeatureScenarioContainer[];

}
