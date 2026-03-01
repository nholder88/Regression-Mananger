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
import { AgentRunService } from './agent-run.service';

@Controller('api/AgentRun')
@UseGuards(JwtAuthGuard)
export class AgentRunController {
  constructor(private readonly service: AgentRunService) {}

  @Get()
  findAll(
    @Query() query: PaginationDto,
    @Query('projectId') projectId?: string,
  ) {
    return this.service.findAll(query, projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() body: { projectId: string; command: string },
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
      status: string;
      summary: string;
      errorMessage: string;
      completedAt: Date;
    }>,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
