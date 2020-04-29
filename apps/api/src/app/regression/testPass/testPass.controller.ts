import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TestPassDto } from '../../Models/testPass.dto';

@Crud({
  model: {
    type: TestPassDto,
  },routes:{exclude:['createManyBase', 'replaceOneBase', 'replaceOneBase']},
  query:{ join:{Header:{eager:false}, featureScenarioContainers:{eager:true}},maxLimit:100 }
})
@ApiTags('TestPass')
@Controller('TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(public service: TestPassService) {}
}
