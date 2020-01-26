import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TestCaseEntity } from '../../Models/orm-entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TestCaseService extends TypeOrmCrudService<TestCaseEntity> {
  constructor(@InjectRepository(TestCaseEntity) repository) {
    super(repository);
  }
}
