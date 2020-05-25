import { User } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class UserDto implements User {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false
  })

  password: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  username: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false
  })

  email: string;

  @BeforeInsert()  async hashPassword() {
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 10);
  }
}
