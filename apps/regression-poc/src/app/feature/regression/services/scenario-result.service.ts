import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { TestPassService } from './testpass.service';
import { ScenarioService } from './scenario.service';
import { combineLatest } from 'rxjs';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { ScenarioResult } from '@qa/api-interfaces';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioResultService {

  constructor(private http: HttpClient,
              private testPassService: TestPassService,
              private scenarioService: ScenarioService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlingService) {
  }

  private rootUrl = `${environment.apiUrl}/ScenarioResult`;

  selectedTestPassChanged(testPassId: string) {
    this.testPassService.selectedTestPassChanged(testPassId);
  }

  selectedFeatureChanged(featureId: string) {
    this.scenarioService.selectedFeatureChanged(featureId);
  }

  saveResults(data: ScenarioResult[]) {
    this.http.post(`${this.rootUrl}/bulk`,{bulk: data}).pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe(x => console.log('save results', x));
  }

//Todo: this needs to get the existing test pass data and mash it together.
  scenarioResultForTestPass$ =
    combineLatest([
      this.testPassService.selectedTestPass$,
      this.scenarioService.selectedFeatureScenarios$
    ]).pipe(
      map(([testPass, scenarios]) => {
        return scenarios.map(x => {
          let s = new ScenarioResult();
          delete s.id;
          // todo: need to handle case when ids are passed in.
          s.scenario = x;
          s.testPass = testPass;
          return s;
        });
      }),

      map(x => {
        let formGroups = x.map(s => this.formBuilder.group(s));
        return this.formBuilder.array(formGroups);
      }),
      tap(x => console.log("Result mapping Form", x)),
      catchError(this.errorHandler.handleError)
    );


reportData$= this.http.get<ScenarioResult[]>(this.rootUrl).pipe(
  delay(1000),
  tap(x=> console.log("Reporting Data", x ))
)


}
