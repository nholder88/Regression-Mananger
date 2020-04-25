import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@qa/api-interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as bcyrpt from 'bcrypt';

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
        if (user?.password === pass)
          retVal = user;
        return retVal;
      })
    );

  }

  login(user: User): any {
    const payload = { username: user.userName, sub: user.id, profile_info: { extra:  'more stufff'  } };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  public static hashPassword(password: string) {
    bcyrpt.hash(password, 10).then(ency => {// save to db
      }
    ).catch(err => console.log(err));
  }

  public static async comparePasswords(plainTextpass, hash) {
    return await bcyrpt.compare(plainTextpass, hash).catch(err => console.log(err));
  }
}
