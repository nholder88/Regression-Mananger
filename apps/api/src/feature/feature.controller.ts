import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { FeatureService } from './feature.service';

@Controller('api/Feature')
@UseGuards(JwtAuthGuard)
export class FeatureController {
  constructor(private readonly service: FeatureService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, ['scenarios', 'scenarios.steps']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, ['scenarios', 'scenarios.steps']);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create({ ...body, userId: req.user.userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
