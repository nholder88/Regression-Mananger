import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@qa/api-interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  validateUser(username: string, pass: string): Observable<User> {
    return this.usersService.findOne(username).pipe(
      map(user => {
        let retVal = null;
        if (user.password === pass)
          retVal = user;
        return retVal;
      })
    );

  }

  login(user: User): Observable<any> {
    const payload = { username: user.userName, sub: user.id };
    return of({
      access_token: this.jwtService.sign(payload)
    });
  }
}
