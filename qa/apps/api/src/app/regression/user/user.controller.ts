import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {RegressionEntity, UserEntity} from "../../Models/orm-entities";
import {UserService} from "./user.service";
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model:{
    type:UserEntity
  }
})
@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(public service:UserService) {
  }


}
