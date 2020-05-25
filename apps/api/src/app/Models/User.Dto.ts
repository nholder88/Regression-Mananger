import { User } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

export class UserDto implements User {
  @ApiProperty({ type: 'number' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;
}
