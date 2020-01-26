import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity } from '../../Models/orm-entities';

@Injectable()
export class IssueService extends TypeOrmCrudService<IssueEntity> {
  constructor(@InjectRepository(IssueEntity) repository) {
    super(repository);
  }
}
