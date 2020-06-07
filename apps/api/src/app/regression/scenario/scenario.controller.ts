import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ScenarioDto } from '../../Models/scenario.dto';
import { ScenarioService } from './scenario.service';
import { UserDto } from '../../Models/User.Dto';

@Crud({
  model: {
    type: ScenarioDto
  },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },

  routes: { exclude: ['replaceOneBase'] },
  query: {
    join: {
      steps: { eager: true }, feature: { eager: true }, user: {
        exclude: ['password']
      }
    },
    sort: [
      { field: 'order', order: 'ASC' },
      { field: 'steps.order', order: 'ASC' }
    ]
  }
})
@CrudAuth({
  property: 'user',
  persist: (user: UserDto) => ({ userId: user.id })
})
@ApiTags('Scenario')
@Controller('Scenario')
@UseGuards(JwtAuthGuard)
export class ScenarioController {
  constructor(public service: ScenarioService) {}
}
