import { Controller, Get } from '@nestjs/common';

import { Message } from '@qa/api-interfaces';

import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger/dist/decorators';

@ApiTags('App')
@Controller('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }
}
