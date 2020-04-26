import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { TestPassService } from './testPass.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TestPassDto } from './dto/TestPass.dto';

@Crud({
  model: {
    type: TestPassDto
  }
})
@ApiTags('TestPass')
@Controller('TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(public service: TestPassService) {}
}
