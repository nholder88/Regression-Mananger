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
import { HeaderService } from './header.service';

@Controller('api/Header')
@UseGuards(JwtAuthGuard)
export class HeaderController {
  constructor(private readonly service: HeaderService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, ['testPasses', 'user']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, ['testPasses', 'user']);
  }

  @Post()
  create(
    @Body() body: Record<string, unknown>,
    @Req() req: { user: { userId: string } },
  ) {
    const payload: Record<string, unknown> = {
      name: body['name'],
      releaseName: body['releaseName'],
      userId: req.user.userId,
    };
    const startDate = body['startDate'];
    const endDate = body['endDate'];
    if (startDate) payload['startDate'] = new Date(startDate as string);
    if (endDate) payload['endDate'] = new Date(endDate as string);
    if (body['isComplete'] !== undefined) payload['isComplete'] = body['isComplete'];
    if (body['isStarted'] !== undefined) payload['isStarted'] = body['isStarted'];
    return this.service.create(payload as { name: string; releaseName: string; userId: string } & Partial<Record<string, unknown>>);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const payload: Record<string, unknown> = { ...body };
    const startDate = body['startDate'];
    const endDate = body['endDate'];
    if (startDate) payload['startDate'] = new Date(startDate as string);
    if (endDate) payload['endDate'] = new Date(endDate as string);
    return this.service.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
