import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TestPassDto } from '../../Models/testPass.dto';

@Injectable()
export class TestPassService extends TypeOrmCrudService<TestPassDto> {
  constructor(@InjectRepository(TestPassDto) repository) {
    super(repository);
  }
}
