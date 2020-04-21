import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { TestPass } from '@qa/api-interfaces';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Crud({
  model: {
    type: TestPass
  }
})
@ApiTags('TestPass')
@Controller('TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(public service: TestPassService) {}
}
