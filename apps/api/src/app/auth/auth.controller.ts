import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators';

import { UserDto } from '../users/Dto/User.Dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  //  Not going to  use the local strategy here because the user and password have to be in query string.
  @Post('auth/login')
  login(@Body() user: UserDto): Observable<any> {

    return this.authService.validateUser(user.username, user.password).pipe(
      map(user => {
        if (!user) {
          throw new UnauthorizedException();
        }
        return this.authService.login(user);
      })
    );

  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}