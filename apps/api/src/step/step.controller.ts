import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { StepService } from './step.service';

@Controller('api/Step')
@UseGuards(JwtAuthGuard)
export class StepController {
  constructor(private readonly service: StepService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, ['user']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, ['user']);
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
