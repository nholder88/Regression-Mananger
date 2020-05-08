import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { TestPassService } from './testpass.service';
import { ScenarioService } from './scenario.service';
import { combineLatest } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ScenarioResult } from '@qa/api-interfaces';
import { FormBuilder } from '@angular/forms';

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

  private rootUrl = 'api/ScenarioResult';

  selectedTestPassChanged(testPassId: string) {
    this.testPassService.selectedTestPassChanged(testPassId);
  }

  selectedFeatureChanged(featureId: string) {
    this.scenarioService.selectedFeatureChanged(featureId);
  }

  saveResults(data) {
    console.log("save results", data)
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
          s.scenario = x;
          s.testPass = testPass;
          return s;
        })
      }),
      tap(x => console.log("Result mapping result", x)),
      map(x => {
        let formGroups=  x.map(s=> this.formBuilder.group(s))
        console.log("Form mapping ", formGroups)
        return this.formBuilder.array(formGroups);
        //this.scenarioForm.patchValue( x);
      }),
      tap(x => console.log("Result mapping Form", x)),
      catchError(this.errorHandler.handleError)
    )


  saveScenarioResults(scenarioResults: ScenarioResult[]) {


  }


}
