import { Regression } from '@qa/api-interfaces';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsBoolean } from 'class-validator';
import { Column } from 'typeorm';

@Entity()
export class RegressionTestingEntity extends Regression {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

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
}
