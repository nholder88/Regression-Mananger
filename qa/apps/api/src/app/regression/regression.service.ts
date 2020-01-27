import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RegressionEntity } from '../Models/orm-entities';

@Injectable()
export class RegressionService extends TypeOrmCrudService<RegressionEntity> {
  constructor(@InjectRepository(RegressionEntity) repo) {
    super(repo);
  }


}
