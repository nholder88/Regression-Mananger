import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TestCaseService } from './test-case.service';
import { TestCaseEntity } from '../../Models/orm-entities';

@Crud({
  model: {
    type: TestCaseEntity
  }
})
@ApiTags('TestCase')
@Controller('TestCase')
export class TestCaseController {
  constructor(public service: TestCaseService) {}
}
