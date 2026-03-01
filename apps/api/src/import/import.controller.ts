import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { ImportService, ImportMapping } from './import.service';

@Controller('api/Import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly service: ImportService) {}

  @Post('preview')
  preview(
    @Body() body: { integrationId: string; query: string },
  ) {
    return this.service.preview(body.integrationId, body.query);
  }

  @Post('execute')
  execute(
    @Body()
    body: {
      integrationId: string;
      mappings: ImportMapping[];
    },
    @Req() req: { user: { userId: string } },
  ) {
    return this.service.execute(
      body.integrationId,
      body.mappings,
      req.user.userId,
    );
  }

  @Get('sessions')
  findAllSessions(@Query() query: PaginationDto) {
    return this.service.findAllSessions(query);
  }

  @Get('sessions/:id')
  findSessionById(@Param('id') id: string) {
    return this.service.findSessionById(id);
  }

  @Post('sessions/:id/undo')
  undoSession(@Param('id') id: string) {
    return this.service.undoSession(id);
  }
}
