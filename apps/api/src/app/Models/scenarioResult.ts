import { ScenarioDto } from './scenario.dto';
import { TestPassDto } from './testPass.dto';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { IScenarioResult } from '@qa/api-interfaces';


@Entity()
export class ScenarioResultDto implements IScenarioResult{
  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @ApiProperty()
  @IsNumber()
  @Column()
  timestamp:Date;

  @ApiProperty()
  @IsString()
  @Column()
  completedBy:string;

  @ApiProperty()
  @IsString()
  @Column()
  status: string;

  @ApiProperty()
  @IsString()
  @Column()
  notes:string;

  @ApiProperty()
  @IsBoolean()
  @Column()
  bugCreated:boolean;

  @ApiProperty()
  @IsString()
  @Column()
  testingLoginUserName: string;

  @ApiProperty()
  @IsString()
  @Column()
  testingRole: string;

  completedSteps:Array<number>
  //Relationships
  @ManyToOne('ScenarioDto', 'results')
  scenario:ScenarioDto;
  @ManyToOne('TestPassDto', 'results')
  testPass:TestPassDto;

}

