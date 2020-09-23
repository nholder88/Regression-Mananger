import { Role } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserRoleDto implements Role {
  // To fully implement later
  permissions: string[];

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string;
}
