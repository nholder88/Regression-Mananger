import { ISteps } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ScenarioDto } from './scenario.dto';
import { UserDto } from './User.Dto';

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

  @Column({ nullable: true })
  userId: string;
  @ManyToOne('UserDto')
  @JoinColumn()
  user: UserDto;

  @ManyToOne('ScenarioDto', 'steps', { onDelete: 'CASCADE' })
  scenario: ScenarioDto;
}
