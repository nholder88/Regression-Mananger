import { Controller } from '@nestjs/common';

import { UserService } from './user.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../../Models/UserEntity';

@Crud({
  model: {
    type: UserEntity
  }
})
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(public service: UserService) {}
}
