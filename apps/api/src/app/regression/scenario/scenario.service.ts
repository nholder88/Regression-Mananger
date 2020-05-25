import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ScenarioDto } from '../../Models/scenario.dto';

@Injectable()
export class ScenarioService extends TypeOrmCrudService<ScenarioDto> {
  constructor(@InjectRepository(ScenarioDto) repository) {
    super(repository);
  }
}
