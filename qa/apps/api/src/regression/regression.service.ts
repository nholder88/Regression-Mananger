import {Injectable} from '@nestjs/common';
import {RegressionEntity} from '@qa/api-interfaces';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {from, Observable, of} from 'rxjs';

@Injectable()
export class RegressionService {
  constructor(
    @InjectRepository(RegressionEntity)
    private readonly regressionRepository: Repository<RegressionEntity>,
  ) {
  }

  findAll(): Observable<RegressionEntity[]> {
    return from(this.regressionRepository.find());

  }

  getOneById(id): Observable<RegressionEntity> {
    return from(this.regressionRepository.findOne(id))
  }

  save(regression: RegressionEntity):Observable<RegressionEntity> {
      return from(this.regressionRepository.save(regression));
     }




}
