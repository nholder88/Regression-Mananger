import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';

import { catchError, map, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { Scenario } from '@qa/api-interfaces';
import { environment } from '../../../../environments/environment';
import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService extends BaseModelService<Scenario> {
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
  ) {
    super(httpClient, errorHandlerService, 'scenario', '');
  }

  private featureSelectedSubject = new BehaviorSubject<string>('');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();

  selectedFeatureScenarios$: Observable<Scenario[]> = combineLatest([
    this.models$,
    this.featureSelectedAction$
  ]).pipe(
    map(([scenarios, featureId]) =>
      scenarios.filter(x => x.feature?.id === featureId)
    )
  );

  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }


}
