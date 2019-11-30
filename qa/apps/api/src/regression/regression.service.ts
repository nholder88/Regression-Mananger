import { Injectable } from '@nestjs/common';
import { Regression } from '@qa/api-interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, of } from 'rxjs';

@Injectable()
export class RegressionService {  constructor(
  @InjectRepository(Regression)
  private readonly regressionRepository: Repository<Regression>,
) {}

findAll(): Promise<Regression[]> {
 return this.regressionRepository.find();

}
}
