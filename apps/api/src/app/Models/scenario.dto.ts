import { IScenario } from '@qa/api-interfaces';
import { FeatureDto } from './feature.dto';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
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
  @Column({ default: '' })
  note: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  order: number;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  timestamp: Date;
  enable: boolean = false;

  @OneToMany('StepDto', 'scenario', { cascade: true, eager: true })
  steps: StepDto[];

  @ManyToOne('FeatureDto', 'scenarios')
  feature: FeatureDto;
}
