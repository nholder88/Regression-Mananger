import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { FeatureScenarioContainer } from '@qa/api-interfaces';
import { catchError, scan } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) { }


  private rootUrl = `${environment.apiUrl }/feature`;

  features$ =
    this.http.get<FeatureScenarioContainer[]>(`${this.rootUrl}?join=scenarios`).pipe(
      catchError(this.errorHandler.handleError)
    );

  saveFeatureSubject = new Subject<FeatureScenarioContainer>();
  featureSavedAction$ = this.saveFeatureSubject.asObservable();

  featureWithAdd$ = merge(
    this.features$,
    this.featureSavedAction$
  ).pipe(
    scan((acc: FeatureScenarioContainer[], value: FeatureScenarioContainer) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveFeature(featureScenarioContainer?: FeatureScenarioContainer) {
    if (!featureScenarioContainer.id) {
      featureScenarioContainer.scenarios = [];
      delete featureScenarioContainer.id;
    }
    const saveObservable$ = featureScenarioContainer.id ? this.http
      .put(this.rootUrl, featureScenarioContainer) : this.http
      .post(this.rootUrl, featureScenarioContainer);

    saveObservable$.pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe();
    this.saveFeatureSubject.next(featureScenarioContainer);
  }
}