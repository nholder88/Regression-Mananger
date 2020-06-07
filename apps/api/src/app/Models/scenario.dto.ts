import { IScenario } from '@qa/api-interfaces';
import { FeatureDto } from './feature.dto';
import {
  Column,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { StepDto } from './step.dto';
import { UserDto } from './User.Dto';

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
  @Column({ default: 0 })
  @Generated('rowid')
  order: number;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  timestamp: Date;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne('UserDto')
  @JoinColumn()
  user: UserDto;

  @OneToMany('StepDto', 'scenario', { cascade: true, eager: true })
  steps: StepDto[];

  @ManyToOne('FeatureDto', 'scenarios', { onDelete: 'CASCADE' })
  feature: FeatureDto;
}
