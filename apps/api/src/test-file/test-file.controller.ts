import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestFileService } from './test-file.service';

@Controller('api/TestFile')
@UseGuards(JwtAuthGuard)
export class TestFileController {
  constructor(private readonly service: TestFileService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      projectId: string;
      scenarioId?: string;
      filePath: string;
      testType: string;
      contentHash: string;
    },
  ) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('bulk')
  bulkCreate(
    @Body()
    body: Array<{
      projectId: string;
      scenarioId?: string;
      filePath: string;
      testType: string;
      contentHash: string;
    }>,
  ) {
    return this.service.bulkCreate(body);
  }
}
