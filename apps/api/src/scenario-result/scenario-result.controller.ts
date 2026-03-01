import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { ScenarioResultService } from './scenario-result.service';
import { ScenarioResult } from '../database/entities/scenario-result.entity';

@Controller('api/ScenarioResult')
@UseGuards(JwtAuthGuard)
export class ScenarioResultController {
  constructor(private readonly service: ScenarioResultService) {}

  @Get()
  findAll(
    @Query() query: PaginationDto,
    @Query('testPassId') testPassId?: string,
    @Query('headerId') headerId?: string,
    @Query('featureId') featureId?: string,
  ) {
    const filters =
      testPassId || headerId || featureId
        ? { testPassId, headerId, featureId }
        : undefined;
    return this.service.findAll(query, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      status: string;
      notes?: string;
      bugCreated?: boolean;
      bugTicketId?: string;
      completedBy?: string;
      completedSteps?: number[];
      scenarioId: string;
      testPassId: string;
    },
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.create({ ...body, userId: req.user.userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      status: string;
      notes: string;
      bugCreated: boolean;
      bugTicketId: string;
      completedBy: string;
      completedSteps: number[];
    }>,
  ) {
    return this.service.update(id, body);
  }

  @Post('bulk')
  bulkUpsert(
    @Body() body: Partial<ScenarioResult>[],
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.bulkUpsert(body, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
