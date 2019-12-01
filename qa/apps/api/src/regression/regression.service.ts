import {Injectable} from '@nestjs/common';
import {Regression} from '@qa/api-interfaces';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {from, Observable, of} from 'rxjs';

@Injectable()
export class RegressionService {
  constructor(
    @InjectRepository(Regression)
    private readonly regressionRepository: Repository<Regression>,
  ) {
  }

  findAll(): Observable<Regression[]> {
    return from(this.regressionRepository.find());

  }

  getOneById(id): Observable<Regression> {
    return from(this.regressionRepository.findOne(id))
  }

  save(regression: Regression):Observable<Regression> {
      return from(this.regressionRepository.save(regression));
     }




}
