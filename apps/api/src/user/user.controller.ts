import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/pagination.dto';
import { UserService } from './user.service';

@Controller('api/User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: { username: string; email: string; password: string }) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ username: string; email: string; password: string }>,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
