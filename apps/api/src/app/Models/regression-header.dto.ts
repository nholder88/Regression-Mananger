import { Entity } from 'typeorm/decorator/entity/Entity';
import { IRegressionHeader } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TestPassDto } from './testPass.dto';
import { UserDto } from './User.dto';

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
  @Column({ default: new Date().toISOString() })
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ default: new Date().toISOString() })
  endDate: Date;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isComplete: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Column()
  isStarted: boolean;

  @Column({ nullable: true })
  userId: string;
  @ManyToOne('UserDto', { onUpdate: 'NO ACTION' } )
  @JoinColumn()
  user: UserDto;

  @OneToMany('TestPassDto', 'Header', { onDelete: 'CASCADE',onUpdate: 'NO ACTION', })
  testPasses: TestPassDto[];
}
