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
import { IntegrationService } from './integration.service';

@Controller('api/Integration')
@UseGuards(JwtAuthGuard)
export class IntegrationController {
  constructor(private readonly service: IntegrationService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      provider: string;
      name: string;
      baseUrl: string;
      projectKey: string;
      authMethod: string;
      authToken?: string;
      isActive?: boolean;
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

  @Post(':id/test')
  testConnection(@Param('id') id: string) {
    return this.service.testConnection(id);
  }
}
