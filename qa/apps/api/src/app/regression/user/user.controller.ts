import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Observable} from "rxjs";
import {RegressionEntity, UserEntity} from "../../Models/orm-entities";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {

  constructor(private userService:UserService) {
  }

  @Get()
  findAll():Observable<UserEntity[]>{
    return this.userService.findAll();
  }
  @Get(':id')
  find(@Param() params):Observable<UserEntity>{
    return this.userService.getOneById(params.id);
  }
  @Post()
  save(@Body() saveInput:UserEntity):Observable<UserEntity>{
    return this.userService.save(saveInput);
  }
}
