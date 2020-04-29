import { IFeatureScenarioContainer, IScenario } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { ScenarioDto } from './scenario.dto';

@Entity()
export class FeatureDto implements IFeatureScenarioContainer{
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  team: string;

  @ManyToOne('ScenarioDto', 'feature', { eager: true })
  scenarios: ScenarioDto[];


}
