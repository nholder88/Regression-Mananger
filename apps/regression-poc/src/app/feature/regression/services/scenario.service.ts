import { Injectable } from '@angular/core';
import { merge, of, Subject } from 'rxjs';
import * as faker from 'faker';
import { catchError, delay, scan, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { Scenario, Steps } from '@qa/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
  }

  private rootUrl = 'api/scenario';

  scenarios$ = this.http.get<Scenario[]>(this.rootUrl).pipe(
    delay(700),
    catchError(this.errorHandler.handleError)
  );


  saveScenarioSubject = new Subject<Scenario>();
  scenarioSavedAction$ = this.saveScenarioSubject.asObservable();

  scenarioWithAdd$ = merge(this.scenarios$, this.scenarioSavedAction$).pipe(
    tap(data => console.log(data)),
    scan((acc: Scenario[], value: Scenario) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveScenario(scenario?: Scenario) {
    if (scenario === null || scenario === undefined) {
      return;
    }

    let saveObservable$ = scenario.id.length > 0 ?
      this.http.put<Scenario>(this.rootUrl, scenario)
      : this.http.post<Scenario>(this.rootUrl, scenario);


    saveObservable$.pipe(tap(scenario => console.log(scenario)))
      .subscribe(x =>
        this.saveScenarioSubject.next(x));
  }


}
