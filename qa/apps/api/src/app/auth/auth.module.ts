import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { JwtStrategy } from './guards/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { environment } from '../../environments/environment';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: environment.jwtConstants.key,
      signOptions: { expiresIn: '60s' }, verifyOptions:{ }
    })
  ],
  providers: [AuthService,  JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
