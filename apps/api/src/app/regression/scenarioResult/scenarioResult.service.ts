import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ScenarioResultDto } from '../../Models/scenarioResult.dto';

@Injectable()
export class ScenarioResultService extends TypeOrmCrudService<
  ScenarioResultDto
> {
  constructor(@InjectRepository(ScenarioResultDto) repository) {
    super(repository);
  }
}
