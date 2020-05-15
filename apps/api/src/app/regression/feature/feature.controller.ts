﻿import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FeatureService } from './feature.service';
import { FeatureDto } from '../../Models/feature.dto';

@Crud({
  model: {
    type: FeatureDto
  },
  routes: { exclude: ['createManyBase', 'replaceOneBase', 'replaceOneBase'] },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },
  query: {
    join: { scenarios: { eager: true }, 'scenarios.steps': { eager: true } },
    maxLimit: 100
  }
})
@ApiTags('Feature')
@Controller('Feature')
@UseGuards(JwtAuthGuard)
export class FeatureController {
  constructor(public service: FeatureService) {}
}
