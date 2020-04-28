import { IFeatureScenarioContainer, IScenario } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class FeatureDto implements IFeatureScenarioContainer{
  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  feature: string;

  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  team: string;

  scenarios: IScenario[];


}
