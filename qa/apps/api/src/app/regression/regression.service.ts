import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { RegressionTestingEntity } from '../Models/regression-orm.model';

@Injectable()
export class RegressionService extends TypeOrmCrudService<
  RegressionTestingEntity
> {
  constructor(@InjectRepository(RegressionTestingEntity) repo) {
    super(repo);
  }
}
