import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';

import {UserService} from "./user/user.service";
import {UserController} from "./user/user.controller";

import {RoleService} from "./user/role.service";
import {RoleController} from "./user/roleController";
import {
  IssueEntity,
  RegressionEntity, TestCaseResultEntity,
  RolesEntity,
  TestCaseEntity,
  TestEntity,
  UserEntity
} from "../Models/orm-entities";
import {IssueService} from "./user/issue.service";
import {TestService} from "./user/test.service";
import {TestCaseService} from "./user/test-case.service";
import {TestCaseController} from "./user/testCaseController";
import {TestController} from "./user/testController";
import {IssueController} from "./user/issueController";
import {TestCaseResultController} from "./user/testCaseResultController";
import {TestCaseResultService} from "./user/test-case-result.service";



@Module({
  imports: [TypeOrmModule.forFeature([RegressionEntity,UserEntity,RolesEntity,TestEntity,IssueEntity,TestCaseEntity,TestCaseResultController])],
  providers: [ RegressionService,UserService,RoleService,TestService,IssueService,TestCaseService,TestCaseResultService],
  controllers: [ RegressionController,UserController,RoleController,TestController,IssueController,TestCaseController,TestCaseResultController],
})
export class RegressionModule {}
