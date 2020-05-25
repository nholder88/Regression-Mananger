import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureDto } from '../../Models/feature.dto';

@Injectable()
export class FeatureService extends TypeOrmCrudService<FeatureDto> {
  constructor(@InjectRepository(FeatureDto) repository) {
    super(repository);
  }
}
