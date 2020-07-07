import { Injectable } from '@angular/core';
import {  RegressionHeader } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';

import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class RegressionHeaderService extends BaseModelService<RegressionHeader> {
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
  ) {
    super(httpClient, errorHandlerService, 'Header', '');
  }


}
