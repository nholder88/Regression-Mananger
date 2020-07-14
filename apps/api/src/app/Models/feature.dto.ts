import { IFeatureScenarioContainer } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { ScenarioDto } from './scenario.dto';
import { UserDto } from './User.Dto';

@Entity()
export class FeatureDto implements IFeatureScenarioContainer {


  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  team: string;

  @Column({ nullable: true })
  userId: string;
  @ManyToOne('UserDto')
  @JoinColumn()
  user: UserDto;

  @OneToMany('ScenarioDto', 'feature', { eager: true, onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  scenarios: ScenarioDto[];
}
