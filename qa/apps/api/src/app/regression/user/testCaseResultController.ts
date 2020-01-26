import { Crud } from '@nestjsx/crud';
import { TestCaseResultEntity, RolesEntity } from '../../Models/orm-entities';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TestCaseResultService } from './test-case-result.service';

@Crud({
  model: {
    type: TestCaseResultEntity
  }
})
@ApiTags('TestCaseResult')
@Controller('TestCaseResult')
export class TestCaseResultController {
  constructor(public service: TestCaseResultService) {}
}
