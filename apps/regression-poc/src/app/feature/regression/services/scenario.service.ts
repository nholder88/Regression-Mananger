import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  merge
} from 'rxjs';

import {
  catchError,
  map,
  publishReplay,
  refCount,
  tap,
  scan
} from 'rxjs/operators';
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
    .get<Scenario[]>(`${this.rootUrl}?join=feature`)
    .pipe(
      publishReplay(1),
      refCount(),
      catchError(this.errorHandler.handleError)
    );
  saveScenarioSubject = new Subject<Scenario>();
  scenarioSavedAction$ = this.saveScenarioSubject.asObservable();

  scenarioWithAdd$ = merge(this.scenarios$, this.scenarioSavedAction$).pipe(
    scan((acc: Scenario[], value: Scenario) => [...acc, value]),
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

  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }

  saveScenario(scenario?: Scenario) {
    if (scenario === null || scenario === undefined) {
      return;
    }

    const saveObservable$ =
      scenario.id.length > 0
        ? this.http.put<Scenario>(`${this.rootUrl}/${scenario.id}`, scenario)
        : this.http.post<Scenario>(this.rootUrl, scenario);

    saveObservable$.subscribe(x => this.saveScenarioSubject.next(x));
  }
}
