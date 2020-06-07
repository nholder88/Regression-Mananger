import { Controller, UseGuards } from '@nestjs/common';
import { RegressionHeaderService } from './regression-header.service';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RegressionHeaderDto } from '../../Models/regression-header.dto';
import { UserDto } from '../../Models/User.Dto';

@Crud({
  model: {
    type: RegressionHeaderDto
  },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },

  query: {
    join: {
      testPasses: {
        eager: true
      }, user: {
        exclude: ['password']
      }
    }
  }
})
@CrudAuth({
  property: 'user',
  persist: (user: UserDto) => ({ userId: user.id })
})
@ApiTags('Regression Header')
@Controller('Header')
@UseGuards(JwtAuthGuard)
export class RegressionHeaderController {
  constructor(public service: RegressionHeaderService) {}
}
