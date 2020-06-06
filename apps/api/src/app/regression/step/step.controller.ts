import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StepDto } from '../../Models/step.dto';
import { StepService } from './step.service';
import { UserDto } from '../../Models/User.Dto';

@Crud({
  model: {
    type: StepDto
  },
  routes: { exclude: ['replaceOneBase'] },

  params: {
    id: { field: 'id', type: 'string', primary: true }
  },

  query: {
    join: {
      user: {
        exclude: ['password']
      }
    }
  }
})
@CrudAuth({
  property: 'user',
  persist: (user: UserDto) => ({ userId: user.id })
})
@ApiTags('Step')
@Controller('Step')
@UseGuards(JwtAuthGuard)
export class StepController {
  constructor(public service: StepService) {}
}
