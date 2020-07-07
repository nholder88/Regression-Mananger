import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { FeatureScenarioContainer } from '@qa/api-interfaces';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
  }

  private rootUrl = `${environment.apiUrl}/feature`;

  features$ = this.http
    .get<FeatureScenarioContainer[]>(`${this.rootUrl}?join=scenarios`)
    .pipe(catchError(this.errorHandler.handleError));

  saveFeatureSubject = new Subject<FeatureScenarioContainer>();
  featureSavedAction$ = this.saveFeatureSubject.asObservable();

  featureWithAdd$ = merge(this.features$, this.featureSavedAction$).pipe(
    scan((acc: FeatureScenarioContainer[], value: FeatureScenarioContainer) => {

      if (acc.findIndex(x => x.id === value.id) > -1) {
        acc.splice(acc.findIndex(x => x.id === value.id), 1, value);
        return acc;
      } else
        return [
          ...acc,
          value
        ];
    }),
    catchError(err => {
      return this.errorHandler.handleError(err);
    })
  );

  deleteFeatureSubject = new BehaviorSubject<string>('');
  deletedFeatureAction$ = this.deleteFeatureSubject.asObservable();

  featureWithDelete$: Observable<FeatureScenarioContainer[]> = merge(
    this.featureWithAdd$,
    this.deletedFeatureAction$
  ).pipe(
    scan(
      (
        acc: FeatureScenarioContainer[],
        value: string | FeatureScenarioContainer[]
      ) => {
        let result = [];
        if (typeof value === 'string') {
          result = [...acc].filter(x => x.id !== value);
        } else {
          result = [...value];
        }
        return result;
      }
    ),
    catchError(err => {
      return this.errorHandler.handleError(err);
    })
  );


  private featureSelectedSubject = new BehaviorSubject<string>('');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();

  selectedFeature$: Observable<FeatureScenarioContainer> = combineLatest([
    this.featureWithDelete$,
    this.featureSelectedAction$
  ]).pipe(
    map(([features, featureId]) => {
        if (features?.length > 1) {
          return features?.find(x => x.id === featureId);
        } else return null;
      }
    )
  );



  saveFeature(featureScenarioContainer?: FeatureScenarioContainer) {
    if (!featureScenarioContainer.id) {
      featureScenarioContainer.scenarios = [];
      delete featureScenarioContainer.id;
    }
    const saveObservable$ = featureScenarioContainer.id
      ? this.http.put<FeatureScenarioContainer>(
        `${this.rootUrl}/${featureScenarioContainer.id}`,
        featureScenarioContainer
      )
      : this.http.post<FeatureScenarioContainer>(
        this.rootUrl,
        featureScenarioContainer
      );

    saveObservable$
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe(x => this.saveFeatureSubject.next(x));
  }

  deleteFeature(id: string) {
    this.http
      .delete<FeatureScenarioContainer>(`${this.rootUrl}/${id}`)
      .subscribe(() => this.deleteFeatureSubject.next(id));
  }

  selectedFeatureChanged(featureId: string) {
    this.featureSelectedSubject.next(featureId);
  }
}
