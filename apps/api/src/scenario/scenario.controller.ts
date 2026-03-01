import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { ScenarioService } from './scenario.service';

@Controller('api/Scenario')
@UseGuards(JwtAuthGuard)
export class ScenarioController {
  constructor(private readonly service: ScenarioService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; note?: string; order?: number; featureId: string; steps?: { name: string; order: number }[] }, @Req() req: { user: { userId: string } }) {
    return this.service.create({ ...body, userId: req.user.userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; note?: string; order?: number; featureId?: string; steps?: { name: string; order: number }[] },
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.update(id, body, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
