import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { ScenarioResultService } from './scenarioResult.service';
import { ScenarioResultDto } from '../../Models/scenarioResult';


@Crud({
  model: {
    type: ScenarioResultDto,
  },routes:{exclude:[ 'replaceOneBase', 'replaceOneBase']},
  query:{ join:{scenario:{}, testPass:{}},maxLimit:100 }
})
@ApiTags('Scenario Result')
@Controller('ScenarioResult')
@UseGuards(JwtAuthGuard)
export class ScenarioResultController {
  constructor(public service: ScenarioResultService) {}
}
