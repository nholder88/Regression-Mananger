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
import { ProjectService } from './project.service';

@Controller('api/Project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id/files')
  findTestFiles(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.service.findTestFiles(id, query);
  }

  @Get(':id/runs')
  findAgentRuns(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.service.findAgentRuns(id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      repoUrl: string;
      language?: string;
      framework?: string;
      testRunner?: string;
      testDirectory?: string;
      sourceDirectory?: string;
      configHash?: string;
    },
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
