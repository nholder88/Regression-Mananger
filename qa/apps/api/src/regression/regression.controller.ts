import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Observable} from "rxjs";
import {RegressionEntity} from "@qa/api-interfaces";
import {RegressionService} from "./regression.service";

@Controller('regression')
export class RegressionController {
  constructor(private regressionService:RegressionService) {
  }

  @Get()
  findAll():Observable<RegressionEntity[]>{
    return this.regressionService.findAll();
  }
  @Get(':id')
  find(@Param() params):Observable<RegressionEntity>{
    return this.regressionService.getOneById(params.id);
  }
  @Post()
  save(@Body() saveInput:RegressionEntity):Observable<RegressionEntity>{
    return this.regressionService.save(saveInput);
  }
}
