import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';

import { catchError, map, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { Scenario } from '@qa/api-interfaces';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  private rootUrl = `${environment.apiUrl}/scenario`;

  scenarios$ = this.http
    .get<Scenario[]>(`${this.rootUrl}`)
    .pipe(catchError(this.errorHandler.handleError));

  saveScenarioSubject = new Subject<Scenario>();
  scenarioSavedAction$ = this.saveScenarioSubject.asObservable();

  deleteScenarioSubject = new BehaviorSubject<string>('');
  deletedScenarioAction$ = this.deleteScenarioSubject.asObservable();

  scenarioWithAdd$ = merge(this.scenarios$, this.scenarioSavedAction$).pipe(
    scan((acc: Scenario[], value: Scenario) => {
      if (acc.findIndex(x => x.id === value.id) > -1) {
        acc.splice(acc.findIndex(x => x.id === value.id), 1, value);
        return acc;
      } else
        return [
          ...acc,
          value
        ];
    }),
    catchError(err => this.errorHandler.handleError(err))
  );

  scenarioWithDelete$ = merge(
    this.scenarioWithAdd$,
    this.deletedScenarioAction$
  ).pipe(
    scan((acc: Scenario[], value: string | Scenario[]) => {
      let result = [];
      if (typeof value === 'string') {
        result = [...acc].filter(x => x.id !== value);
      } else {
        result = [...value];
      }
      return result;
    }),
    catchError(err => this.errorHandler.handleError(err))
  );

  private featureSelectedSubject = new BehaviorSubject<string>('');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();

  selectedFeatureScenarios$: Observable<Scenario[]> = combineLatest([
    this.scenarios$,
    this.featureSelectedAction$
  ]).pipe(
    map(([scenarios, featureId]) =>
      scenarios.filter(x => x.feature?.id === featureId)
    )
  );
  private scenarioSelectedSubject = new BehaviorSubject<string>('');
  scenarioSelectedAction$ = this.scenarioSelectedSubject.asObservable();
  selectedScenario$: Observable<Scenario> = combineLatest([
    this.scenarioWithDelete$,
    this.scenarioSelectedAction$
  ]).pipe(
    map(([scenarios, scenarioId]) => {
        if (scenarios?.length > 0) {
          return scenarios?.find(x => x.id === scenarioId);
        } else return null;
      }
    )
  );


  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }

  saveScenario(scenario?: Scenario) {
    if (scenario === null || scenario === undefined) {
      return;
    }

    const saveObservable$ = scenario.id
      ? this.http.patch<Scenario>(`${this.rootUrl}/${scenario.id}`, scenario)
      : this.http.post<Scenario>(this.rootUrl, scenario);

    saveObservable$.subscribe(x => this.saveScenarioSubject.next(x));
  }

  deleteScenario(id: string) {
    this.http
      .delete<Scenario>(`${this.rootUrl}/${id}`)
      .subscribe(() => this.deleteScenarioSubject.next(id));
  }


  selectedScenarioChanged(scenarioId: string) {
    this.scenarioSelectedSubject.next(scenarioId);
  }
}
