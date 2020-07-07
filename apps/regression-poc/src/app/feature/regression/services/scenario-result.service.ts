import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { TestPassService } from './testpass.service';
import { ScenarioService } from './scenario.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ScenarioResult } from '@qa/api-interfaces';
import { FormArray, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class ScenarioResultService extends BaseModelService<ScenarioResult>{
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
    private scenarioService: ScenarioService,
    private formBuilder: FormBuilder,
    private testPassService: TestPassService
  ) {
    super(httpClient, errorHandlerService, 'ScenarioResult', '');
  }



  private testPassChangedSubject = new BehaviorSubject<ScenarioResult[]>(null);
  testPassSelectedAction$ = this.testPassChangedSubject.asObservable();

  //Todo: this needs to get the existing test pass data and mash it together.
  scenarioResultForTestPass$: Observable<FormArray> = combineLatest([
    this.testPassSelectedAction$,
    this.scenarioService.selectedFeatureScenarios$,
    this.testPassService.selectedTestPass$
  ]).pipe(
    map(([scenarioResults, scenarios, testPass]) => {
      return scenarios.map(x => {
        // find result that goes with scenario
        const existing = scenarioResults.find(sc => sc.scenario.id == x.id);
        if (existing) {
          existing.scenario = x;
          existing.testPass = testPass;
          return existing;
        } else {
          const s = new ScenarioResult();
          delete s.id;
          s.scenario = x;
          s.testPass = testPass;
          return s;
        }
      });
    }),
    map(x => {
      const formGroups = x.map(s => this.formBuilder.group(s));
      return this.formBuilder.array(formGroups);
    }),
    catchError(this.errorHandler.handleError)
  );

  reportData$ = this.http
    .get<ScenarioResult[]>(`${this.rootUrl}?join=scenario&join=testPass`)
    .pipe(tap(x => console.log('Reporting Data', x)));

  selectedTestPassChanged(testPassId: string) {
    if (testPassId) {
      this.http
        .get<ScenarioResult[]>(
          `${this.rootUrl}?join=scenario&join=testPass&filter=testPass.id||$eq||${testPassId}`
        )
        .subscribe(testPass => {
          this.testPassChangedSubject.next(testPass);
          this.testPassService.selectedTestPassChanged(testPassId);
        });
    } else {
      this.testPassChangedSubject.next(null);
    }
  }

  saveResults(data: ScenarioResult[]) {
    if (data.length > 0) {
      this.http
        .post(`${this.rootUrl}/bulk`, { bulk: data })
        .pipe(catchError(err => this.errorHandler.handleError(err)))
        .subscribe(x => console.log('save results', x));
    }
  }

  selectedFeatureChanged(featureId: string) {
    this.scenarioService.selectedFeatureChanged(featureId);
  }
}
