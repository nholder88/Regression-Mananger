import { Controller, UseGuards } from '@nestjs/common';
import { RegressionService } from './regression.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { RegressionTestingEntity } from '../Models/regression-orm.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: RegressionTestingEntity
  }
})
@ApiTags('regression')
@Controller('regression')
@UseGuards(JwtAuthGuard)
export class RegressionController {
  constructor(public service: RegressionService) {}
}
