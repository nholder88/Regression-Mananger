import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { Area, Regression, User } from '@qa/api-interfaces';
import { catchError, scan, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../Shared/services/error-handling.service';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../../Shared/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RegressionService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService,
    private loginService: LoginService
  ) {
  }

  private rootUrl = environment.apiUrl + '/regressionheader';

  // TODO: Remove this once the API is hosted
  regressions$ = this.loginService.isUserLoggedIn()
    ? this.http.get<Regression[]>(this.rootUrl).pipe(
      tap(data =>
        console.log('regresssion service-API', JSON.stringify(data))
      ),
      catchError(this.errorHandler.handleError)
    )
    : of<Regression[]>([
      new Regression([], 'Default Test', true, true, 'Summer 2020'),
      new Regression([], 'QA Test', true, true, 'Alpha-2021')
    ]).pipe(
      tap(data =>
        console.log('regresssion service-DEMO', JSON.stringify(data))
      ),
      catchError(this.errorHandler.handleError)
    );
  saveRegressionSubject = new Subject<Regression>();
  regressionSavedAction$ = this.saveRegressionSubject.asObservable();

  regressionWithAdd$ = merge(
    this.regressions$,
    this.regressionSavedAction$
  ).pipe(
    tap(data => console.log(data)),
    scan((acc: Regression[], value: Regression) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );
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

  saveRegression(regression?: Regression) {
    if (regression.id) {
      this.http
        .put(this.rootUrl, regression)
        // tslint:disable-next-line:no-shadowed-variable
        .pipe(tap(regression => console.log(regression)))
        .subscribe();
    } else {
      regression.testPasses = [];
      delete regression.id;
      this.http
        .post(this.rootUrl, regression)
        // tslint:disable-next-line:no-shadowed-variable
        .pipe(tap(regression => console.log(regression)))
        .subscribe();
    }
    this.saveRegressionSubject.next(regression);
  }
}
