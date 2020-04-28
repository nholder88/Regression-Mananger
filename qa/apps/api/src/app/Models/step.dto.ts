import { IScenario, ISteps } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class StepDto implements ISteps{
  name: string;



  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @ApiProperty()
  @IsNumber()
  @Column()
  order: number;


  scenario: IScenario

}
