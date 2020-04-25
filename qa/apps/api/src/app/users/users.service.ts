import { Injectable } from '@nestjs/common';
import { User } from '@qa/api-interfaces';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        userName: environment.admin.username,
        password: environment.admin.password
      }
    ];
  }

   findOne(username: string): Observable<User> {
    // Replace with Database backed look up
    return of<User>(this.users.find(user => user.userName === username));
  }
}
