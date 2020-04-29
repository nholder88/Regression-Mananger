import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TestPassDto } from '../../Models/TestPass.dto';

@Crud({
  model: {
    type: TestPassDto,
  },
  query:{ join:{Header:{eager:false}},maxLimit:100 }
})
@ApiTags('TestPass')
@Controller('TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(public service: TestPassService) {}
}
