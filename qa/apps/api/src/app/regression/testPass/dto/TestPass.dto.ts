import { FeatureScenarioContainer, IFeatureScenarioContainer, ITestPass, TestPass } from '@qa/api-interfaces';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
@Entity()
export class TestPassDto implements ITestPass{

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  creator: string;

  featureScenarioContainers: FeatureScenarioContainer[];
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
  @ApiProperty({ type: 'string' })
  @IsDate()
  @Column()
  timeStamp: Date;

}
