import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TestPassDto } from '../../Models/testPass.dto';
import { UserDto } from '../../Models/User.dto';

@Crud({
  model: {
    type: TestPassDto
  },

  params: {
    id: { field: 'id', type: 'string', primary: true }
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },

  query: {
    join: {
      Header: { eager: false },
      featureScenarioContainers: { eager: true },
      results: { eager: false },
      'results.scenario': { eager: false, alias: 'scenario' },
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
@ApiTags('TestPass')
@Controller('TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(public service: TestPassService) {}
}
