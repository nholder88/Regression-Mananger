import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('App')
export class AppController {
  constructor() {}

  @Get('heartbeat')
  getData(): string {
    return `Api is live as of ${Date.now().toLocaleString()}`;
  }
}
