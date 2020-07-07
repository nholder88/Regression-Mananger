import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { FeatureScenarioContainer } from '@qa/api-interfaces';
import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends BaseModelService<FeatureScenarioContainer>{
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
  ) {
    super(httpClient, errorHandlerService, 'feature', '?join=scenarios`');
  }



}
