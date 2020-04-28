import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { RegressionHeaderDto } from '../../Models/regression-header.dto';

@Injectable()
export class RegressionHeaderService extends TypeOrmCrudService<
  RegressionHeaderDto
> {
  constructor(@InjectRepository(RegressionHeaderDto) repo) {
    super(repo);
  }
}
