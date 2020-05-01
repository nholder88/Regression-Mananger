import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { Area, RegressionHeader } from '@qa/api-interfaces';
import { catchError, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegressionHeaderService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
  }

  private rootUrl = `${environment.apiUrl }/header`;

  regressions$ =
    this.http.get<RegressionHeader[]>(`${this.rootUrl}`).pipe(
      catchError(this.errorHandler.handleError)
    );

  saveRegressionSubject = new Subject<RegressionHeader>();
  regressionSavedAction$ = this.saveRegressionSubject.asObservable();

  regressionWithAdd$ = merge(
    this.regressions$,
    this.regressionSavedAction$
  ).pipe(
    scan((acc: RegressionHeader[], value: RegressionHeader) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveRegression(regression?: RegressionHeader) {
    if (!regression.id) {
      regression.testPasses = [];
      delete regression.id;
    }
    const saveObservable$ = regression.id ? this.http
      .put(this.rootUrl, regression) : this.http
      .post(this.rootUrl, regression);

    saveObservable$.pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe();
    this.saveRegressionSubject.next(regression);
  }

  completeRegression(regression: RegressionHeader) {
    // Update regression and mark it as Completed
    regression.isComplete = true;
    this.http.put(this.rootUrl, regression).pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe();

  }


  areas$: Observable<Area[]> = of<Area[]>([
    {
      id: 1,
      name: 'Chart',
      features: [
        {
          id: 2,
          name: 'Letters',
          enable: false,
          teams: [{ id: 0, name: 'OU' }],
          subFeatures: [
            {
              id: 3,
              name: 'Faxing',
              teams: [{ id: 0, name: 'OU' }],
              enable: false,
              subFeatures: [
                {
                  id: 4,
                  name: 'Re-faxing',
                  teams: [{ id: 0, name: 'OU' }],
                  enable: false,
                  subFeatures: null
                }
              ]
            },
            {
              id: 11,
              name: 'Signing',
              enable: false,
              teams: [{ id: 0, name: 'OU' }],
              subFeatures: null
            },
            {
              id: 12,
              name: 'Generation',
              enable: false,
              teams: [{ id: 0, name: 'OU' }],
              subFeatures: null
            },
            {
              id: 13,
              name: 'Saving',
              enable: false,
              teams: [{ id: 0, name: 'OU' }],
              subFeatures: null
            },
            {
              id: 14,
              name: 'Deleting',
              enable: false,
              teams: [{ id: 0, name: 'OU' }],
              subFeatures: null
            },
            {
              id: 15,
              name: 'Re-signing',
              enable: false,
              teams: [{ id: 0, name: 'OU' }],
              subFeatures: null
            }
          ]
        }
      ]
    },
    {
      id: 22,
      name: 'CQM',
      features: [
        {
          id: 20,
          name: 'Calculation',
          enable: false,
          teams: [{ id: 0, name: 'OD' }],
          subFeatures: null
        },
        {
          id: 25,
          name: 'Medical Lookups',
          enable: false,
          teams: [{ id: 0, name: 'OD' }],
          subFeatures: null
        },
        {
          id: 16,
          name: 'Presentation',
          enable: false,
          teams: [{ id: 0, name: 'OD' }],
          subFeatures: null
        },
        {
          id: 17,
          name: 'Performance',
          enable: false,
          teams: [{ id: 0, name: 'OD' }],
          subFeatures: null
        }
      ]
    },
    {
      id: 33,
      name: 'Custom Integrations',
      features: [
        {
          id: 30,
          name: 'Northwell Tasking',
          enable: false,
          teams: [{ id: 0, name: 'OU' }],
          subFeatures: null
        },
        {
          id: 31,
          name: 'HIE',
          enable: false,
          teams: [{ id: 0, name: 'OU' }],
          subFeatures: null
        },
        {
          id: 32,
          name: 'Northwell HL7',
          enable: false,
          teams: [{ id: 0, name: 'OD' }],
          subFeatures: null
        }
      ]
    }
  ]);
}
