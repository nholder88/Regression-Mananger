import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { TestPassService } from './testpass.service';
import { ScenarioService } from './scenario.service';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ScenarioResult } from '@qa/api-interfaces';
import { FormArray, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioResultService {
  constructor(
    private http: HttpClient,
    private testPassService: TestPassService,
    private scenarioService: ScenarioService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlingService
  ) {}

  private rootUrl = `${environment.apiUrl}/ScenarioResult`;

  //Todo: this needs to get the existing test pass data and mash it together.
  scenarioResultForTestPass$: Observable<FormArray> = combineLatest([
    this.testPassService.selectedTestPass$,
    this.scenarioService.selectedFeatureScenarios$
  ]).pipe(
    tap(x => console.log('scenarioResultForTestPass', x)),
    map(([testPass, scenarios]) => {
      //Need to check if the selected feature scenarios are in the listing as well

      if (testPass.results?.length > 0) {
        return testPass.results;
      } else
        return scenarios.map(x => {
          const s = new ScenarioResult();
          delete s.id;
          // todo: need to handle case when ids are passed in.
          s.scenario = x;
          s.testPass = testPass;
          return s;
        });
    }),
    map(x => {
      const formGroups = x.map(s => this.formBuilder.group(s));
      return this.formBuilder.array(formGroups);
    }),
    tap(x => console.log('Result mapping Form', x)),
    catchError(this.errorHandler.handleError)
  );

  reportData$ = this.http
    .get<ScenarioResult[]>(this.rootUrl + `?join=scenario&join=testPass`)
    .pipe(
      tap(x => console.log('Reporting Data', x))
    );

  selectedTestPassChanged(testPassId: string) {
    this.testPassService.selectedTestPassChanged(testPassId);
  }

  selectedFeatureChanged(featureId: string) {
    this.scenarioService.selectedFeatureChanged(featureId);
  }

  saveResults(data: ScenarioResult[]) {
    this.http
      .post(`${this.rootUrl}/bulk`, { bulk: data })
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe(x => console.log('save results', x));
  }
}
