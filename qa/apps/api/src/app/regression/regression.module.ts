import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionController } from './regression.controller';
import { RegressionService } from './regression.service';

import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

import { RoleService } from './user/role.service';
import { RoleController } from './user/roleController';
import {
  IssueEntity,
  TestCaseResultEntity,
  RolesEntity,
  TestCaseEntity,
  TestEntity
} from '../Models/orm-entities';
import { User } from '../Models/UserEntity';

import { RegressionTestingEntity } from '../Models/regression-orm.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegressionTestingEntity,
      User,
      RolesEntity,
      TestEntity,
      IssueEntity,
      TestCaseEntity,
      TestCaseResultEntity
    ])
  ],
  providers: [RegressionService, UserService, RoleService],
  controllers: [RegressionController, UserController, RoleController]
})
export class RegressionModule {}
