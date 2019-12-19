﻿import {Injectable} from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {from, Observable} from 'rxjs';
import { UserEntity } from '../../Models/orm-entities';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
  }

  findAll(): Observable<UserEntity[]> {
    return from(this.repository.find());

  }

  getOneById(id): Observable<UserEntity> {
    return from(this.repository.findOne(id))
  }

  save(regression: UserEntity): Observable<UserEntity> {
    return from(this.repository.save(regression));
  }
}

