import { Entity } from 'typeorm/decorator/entity/Entity';
import { IRegressionHeader } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, OneToMany } from 'typeorm';
import { TestPassDto } from './testPass.dto';

@Entity()
export class RegressionHeaderDto implements IRegressionHeader {
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

  @OneToMany('TestPassDto', 'Header', { cascade: true })
  testPasses: TestPassDto[];
}
