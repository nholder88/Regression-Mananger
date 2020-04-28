import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TestPassDto } from '../../Models/TestPass.dto';

@Injectable()
export class TestPassService extends TypeOrmCrudService<TestPassDto> {
  constructor(@InjectRepository(TestPassDto) repository) {
    super(repository);
  }
}
