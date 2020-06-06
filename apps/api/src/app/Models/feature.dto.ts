import { IFeatureScenarioContainer } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
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
  @OneToOne('UserDto')
  @JoinColumn()
  user: UserDto;

  @OneToMany('ScenarioDto', 'feature', { eager: true, cascade: true })
  scenarios: ScenarioDto[];
}
