import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import {  RegressionHeader } from '@qa/api-interfaces';
import { catchError, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class RegressionHeaderService extends BaseModelService<RegressionHeader> {
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
  ) {
    super(httpClient, errorHandlerService, 'header', '');
  }


}
