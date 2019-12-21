import {UserEntity} from "../../Models/orm-entities";
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)   repository
  ) {
    super(repository);
  }

}




