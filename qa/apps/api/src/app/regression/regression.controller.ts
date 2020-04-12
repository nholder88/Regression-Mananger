import { Controller } from '@nestjs/common';
import { RegressionService } from './regression.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { RegressionTestingEntity } from '../Models/regression-orm.model';

@Crud({
  model: {
    type: RegressionTestingEntity
  }
})
@ApiTags('regression')
@Controller('regression')
export class RegressionController {
  constructor(public service: RegressionService) {}
}
