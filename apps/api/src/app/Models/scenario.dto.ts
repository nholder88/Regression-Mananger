import { IScenario, ISteps } from '@qa/api-interfaces';
import { FeatureDto } from './feature.dto';
import { Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { StepDto } from './step.dto';


@Entity()
export class ScenarioDto implements IScenario {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  note: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  order: number;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  timestamp: Date;

  @OneToMany("StepDto", "scenario")
  steps: StepDto[];


  @ManyToOne('FeatureDto', 'scenarios')
  feature: FeatureDto;
}
