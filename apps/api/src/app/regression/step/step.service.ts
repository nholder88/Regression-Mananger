import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StepDto } from '../../Models/step.dto';

@Injectable()
export class StepService extends TypeOrmCrudService<StepDto> {
  constructor(@InjectRepository(StepDto) repository) {
    super(repository);
  }
}
