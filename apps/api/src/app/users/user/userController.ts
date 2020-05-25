import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from '../../Models/User.Dto';

@Crud({
  model: {
    type: UserDto
  },
  routes: { exclude: ['replaceOneBase', ] },
  params: {
    id: { field: 'username', type: 'string', primary: true }
  },
  query: { join: {}, maxLimit: 100, exclude: ['password'] }
})
@ApiTags('User')
@Controller('User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(public service: UsersService) {}
}
