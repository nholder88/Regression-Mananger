import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest,  Observable,} from 'rxjs';

import {catchError,  map,  shareReplay, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { Scenario} from '@qa/api-interfaces';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
  }

  private rootUrl = `${environment.apiUrl}/scenario`;

  scenarios$ = this.http.get<Scenario[]>(`${this.rootUrl}?join=feature`).pipe(
    tap(x=> console.log("scenario svc: ", x)),
    catchError(this.errorHandler.handleError),
    shareReplay(1, 6000)
  );



  private featureSelectedSubject = new BehaviorSubject<string>('');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();


  selectedFeatureScenarios$: Observable<Scenario[]> = combineLatest([
    this.scenarios$,
    this.featureSelectedAction$
  ]).pipe(
    map(([scenarios, featureId]) =>
      scenarios.filter( x=> x.feature?.id===featureId)
    ),
    tap(feature => console.log('Selected Scenarios For Feature', feature))
  );

  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }


  /*
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

  */
}
