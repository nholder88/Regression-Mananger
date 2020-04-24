import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators';

import { UserDto } from '../users/Dto/User.Dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  //  Not going to  use the local strategy here because the user and password have to be in query string.
  @Post('auth/login')
  login(@Body() user: UserDto) {
    let currentUser = null;
    // Make sure user is valid
    this.authService.validateUser(user.userName, user.password).subscribe(user => currentUser = this.authService.login(user));
    // Issue JWT
    if (!currentUser) {
      throw new UnauthorizedException();
    } else {
      return this.authService.login(currentUser);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
