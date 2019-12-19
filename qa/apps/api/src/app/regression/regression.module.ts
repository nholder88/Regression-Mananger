import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';

import {RegressionEntity, UserEntity} from "../Models/orm-entities";
import {UserService} from "./user/user.service";
import {UserController} from "./user/user.controller";



@Module({
  imports: [TypeOrmModule.forFeature([RegressionEntity,UserEntity])],
  providers: [ RegressionService,UserService],
  controllers: [ RegressionController,UserController],
})
export class RegressionModule {}
