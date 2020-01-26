import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TestEntity } from '../../Models/orm-entities';
import { TestService } from './test.service';

@Crud({
  model: {
    type: TestEntity
  }
})
@ApiTags('Test')
@Controller('Test')
export class TestController {
  constructor(public service: TestService) {}
}
