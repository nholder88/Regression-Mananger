import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { TestPass } from '@qa/api-interfaces';

@Crud({
  model: {
    type: TestPass
  }
})
@ApiTags('TestPass')
@Controller('TestPass')
export class TestPassController {
  constructor(public service: TestPassService) {}
}
