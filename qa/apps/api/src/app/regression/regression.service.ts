import {Injectable} from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm';

import {RegressionEntity} from "../Models/orm-entities";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class RegressionService extends TypeOrmCrudService<RegressionEntity>{
  constructor(
    @InjectRepository(RegressionEntity) repo
  ) {
    super(repo);
  }






}
