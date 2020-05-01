import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StepDto } from '../../Models/step.dto';
import { StepService } from './step.service';


@Crud({
  model: {
    type: StepDto,
  },routes:{exclude:[ 'replaceOneBase', 'replaceOneBase']},
  query:{ join:{},maxLimit:100 }
})
@ApiTags('Step')
@Controller('Step')
@UseGuards(JwtAuthGuard)
export class StepController {
  constructor(public service: StepService) {}
}
