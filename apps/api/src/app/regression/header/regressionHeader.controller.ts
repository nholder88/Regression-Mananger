import { Controller, UseGuards } from '@nestjs/common';
import { RegressionHeaderService } from './regression-header.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RegressionHeaderDto } from '../../Models/regression-header.dto';

@Crud({
  model: {
    type: RegressionHeaderDto
  }, query: {
    join: {
      testPasses:
        {
          eager: true
        }
    }
  }
})

@ApiTags('regression')
@Controller('regressionHeader')
@UseGuards(JwtAuthGuard)
export class RegressionHeaderController {
  constructor(public service: RegressionHeaderService) {
  }
}
