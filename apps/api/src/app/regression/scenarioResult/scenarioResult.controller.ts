import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { ScenarioResultService } from './scenarioResult.service';
import { ScenarioResultDto } from '../../Models/scenarioResult';
import { UserDto } from '../../Models/User.Dto';

@Crud({
  model: {
    type: ScenarioResultDto
  },
  routes: { exclude: ['replaceOneBase'] },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },

  query: {
    join: {
      scenario: {},
      testPass: {},
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
@ApiTags('Scenario Result')
@Controller('ScenarioResult')
@UseGuards(JwtAuthGuard)
export class ScenarioResultController {
  constructor(public service: ScenarioResultService) {}
}
