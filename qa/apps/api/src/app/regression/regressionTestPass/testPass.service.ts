import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestPass } from '@qa/api-interfaces';

@Injectable()
export class TestPassService extends TypeOrmCrudService<TestPass> {
  constructor(@InjectRepository(TestPass) repository) {
    super(repository);
  }
}
