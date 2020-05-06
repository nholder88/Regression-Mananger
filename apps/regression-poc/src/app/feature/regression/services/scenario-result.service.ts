import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../../Shared/services/error-handling.service";
import {TestPassService} from "./testpass.service";
import {ScenarioService} from "./scenario.service";
import {combineLatest} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {ScenarioResult} from "@qa/api-interfaces";
import {FormBuilder} from "@angular/forms";

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
    console.log("", data)
  }

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
      catchError(this.errorHandler.handleError)
    )

  getScenarioForm() {
    let form;
    this.scenarioResultForTestPass$.pipe(tap(c=> console.log(c))).subscribe(d => {
        form = this.formBuilder.group(d);
        return form;
      }
    )

  }


}
