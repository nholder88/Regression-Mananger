import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@qa/api-interfaces';
import { UserDto } from '../../Models/User.Dto';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserDto> {
  private readonly users: User[];

  constructor(@InjectRepository(UserDto) repository) {
    super(repository);
  }
}
