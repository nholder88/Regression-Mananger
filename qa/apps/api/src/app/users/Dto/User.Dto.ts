import { User } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

export class UserDto implements User {

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;
}
