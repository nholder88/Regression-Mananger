import { ISteps } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { ScenarioDto } from './scenario.dto';
@Entity()
export class StepDto implements ISteps {
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  order: number;

  @ManyToOne('ScenarioDto', 'steps')
  scenario: ScenarioDto;
}
