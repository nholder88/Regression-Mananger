import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Observable} from "rxjs";
import {Regression} from "@qa/api-interfaces";
import {RegressionService} from "./regression.service";

@Controller('regression')
export class RegressionController {
  constructor(private regressionService:RegressionService) {
  }

  @Get()
  findAll():Observable<Regression[]>{
    return this.regressionService.findAll();
  }
  @Get(':id')
  find(@Param() params):Observable<Regression>{
    return this.regressionService.getOneById(params.id);
  }
  @Post()
  save(@Body() saveInput:Regression):Observable<Regression>{
    return this.regressionService.save(saveInput);
  }
}
