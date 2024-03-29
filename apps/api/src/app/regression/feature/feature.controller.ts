﻿import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FeatureService } from './feature.service';
import { FeatureDto } from '../../Models/feature.dto';
import { UserDto } from '../../Models/User.dto';

@Crud({
  model: {
    type: FeatureDto
  },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },
  routes: {
    exclude: ['createManyBase']
  },

  query: {
    join: {
      scenarios: { eager: true },
      'scenarios.steps': { eager: true },
      user: {
        exclude: ['password']
      }
    },
    maxLimit: 100
  }
})
@CrudAuth({
  property: 'user',
  persist: (user: UserDto) => ({ userId: user.id })
})
@ApiTags('Feature')
@Controller('Feature')
@UseGuards(JwtAuthGuard)
export class FeatureController {
  constructor(public service: FeatureService) {}
}
