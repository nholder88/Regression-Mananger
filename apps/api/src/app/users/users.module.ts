import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDto } from '../Models/User.dto';
import { UsersService } from './user/users.service';
import { UserController } from './user/userController';

@Module({
  imports: [TypeOrmModule.forFeature([UserDto])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule {}
