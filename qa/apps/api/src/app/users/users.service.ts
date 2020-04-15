import { Injectable } from '@nestjs/common';
import { User } from '@qa/api-interfaces';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        userName: 'john',
        password: 'changeme'
      },
      {
        id: 2,
        userName: 'chris',
        password: 'secret'
      },
      {
        id: 3,
        userName: 'maria',
        password: 'guess'
      }
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.userName === username);
  }
}
