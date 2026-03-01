import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { TestPassService } from './test-pass.service';

@Controller('api/TestPass')
@UseGuards(JwtAuthGuard)
export class TestPassController {
  constructor(private readonly service: TestPassService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, [
      'header',
      'features',
      'scenarioResults',
    ]);
  }

  @Get(':id/full')
  findFull(@Param('id') id: string) {
    return this.service.findFullExecutionTree(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, ['scenarioResults']);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      testingLoginUserName?: string;
      testingRole?: string;
      isComplete?: boolean;
      isStarted?: boolean;
      headerId: string;
      featureIds?: string[];
    },
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      testingLoginUserName: string;
      testingRole: string;
      isComplete: boolean;
      isStarted: boolean;
      headerId: string;
      featureIds: string[];
    }>,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
