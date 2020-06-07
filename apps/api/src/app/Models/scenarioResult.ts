import { ScenarioDto } from './scenario.dto';
import { TestPassDto } from './testPass.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { IScenarioResult } from '@qa/api-interfaces';
import { UserDto } from './User.Dto';

@Entity()
export class ScenarioResultDto implements IScenarioResult {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  timestamp: Date;

  @ApiProperty()
  @IsString()
  @Column()
  completedBy: string;

  @ApiProperty()
  @IsString()
  @Column()
  status: string;

  @ApiProperty()
  @IsString()
  @Column()
  notes: string;

  @ApiProperty()
  @IsBoolean()
  @Column()
  bugCreated: boolean;

  @Column({ nullable: true })
  userId: string;
  @OneToOne('UserDto')
  @JoinColumn()
  user: UserDto;

  completedSteps: Array<number>;
  //Relationships
  @ManyToOne('ScenarioDto', 'results', { onDelete: 'CASCADE' })
  scenario: ScenarioDto;
  @ManyToOne('TestPassDto', 'results', { onDelete: 'CASCADE' })
  testPass: TestPassDto;
}
