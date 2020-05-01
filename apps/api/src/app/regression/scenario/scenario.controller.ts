import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ScenarioDto } from '../../Models/scenario.dto';
import { ScenarioService } from './scenario.service';


@Crud({
  model: {
    type: ScenarioDto,
  },routes:{exclude:['createManyBase', 'replaceOneBase', 'replaceOneBase']},
  query:{ join:{},maxLimit:100 }
})
@ApiTags('Scenario')
@Controller('Scenario')
@UseGuards(JwtAuthGuard)
export class ScenarioController {
  constructor(public service: ScenarioService) {}
}
