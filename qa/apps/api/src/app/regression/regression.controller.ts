import { Controller } from '@nestjs/common';
import { RegressionService } from './regression.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { RegressionEntity } from '../Models/orm-entities';

@Crud({
  model: {
    type: RegressionEntity
  }
})
@ApiTags('regression')
@Controller('regression')
export class RegressionController {
  constructor(public service: RegressionService) {}
}
