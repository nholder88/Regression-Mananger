import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcyrpt from 'bcrypt';
import { UsersService } from '../../users/user/users.service';
import { environment } from '../../../environments/environment';
import { UserDto } from '../../Models/User.Dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto> {
    //this is a admin path; yes its not ideal.
    if (
      username === environment.admin.username &&
      pass === environment.admin.password
    ) {
      const adminUser = new UserDto();
      adminUser.username = username;
      adminUser.email = 'admin@admin.com';
      adminUser.id = 'admin';
      return adminUser;
    }

    let returnUser = null;
    const foundUser = await this.usersService.findOne({ username: username });
    const isCorrectPassword = await this.comparePasswords(
      pass,
      foundUser.password
    );
    if (isCorrectPassword) {
      returnUser = foundUser;
    }
    return returnUser;
  }

  login(user: UserDto): any {
    const payload = {
      username: user.username,
      sub: user.id,
      profile_info: { extra: '' }
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  public async comparePasswords(plainTextpass, hash) {
    return await bcyrpt
      .compare(plainTextpass, hash)
      .catch(err => console.log(err));
  }
}
