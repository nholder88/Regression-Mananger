import { Injectable } from '@nestjs/common';
import { User } from '@qa/api-interfaces';
import { Observable, of } from 'rxjs';

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

   findOne(username: string): Observable<User> {
    return of<User>(this.users.find(user => user.userName === username));
  }
}
