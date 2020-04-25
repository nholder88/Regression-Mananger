import { User } from '@qa/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userName: string;
  @ApiProperty()
  password: string;
}
