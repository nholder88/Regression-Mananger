import { Entity } from 'typeorm/decorator/entity/Entity';
import { ITestPass, Regression } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, ManyToOne, OneToMany } from 'typeorm';

import { IRegression } from '@qa/api-interfaces';
import { TestPassDto } from './TestPass.dto';


@Entity()
export class RegressionHeaderDto implements IRegression {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Column()
  releaseName: string;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ default: '0001-01-01' })
  endDate: Date;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isComplete: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isStarted: boolean;

  @OneToMany('TestPassDto','Header')
  testPasses: TestPassDto[];
}
