import {Injectable} from '@angular/core';
import {merge, Observable, Subject} from "rxjs";
import {Regression, User} from "@qa/api-interfaces";
import {throwError} from 'rxjs';
import {catchError, scan, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../Shared/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class RegressionService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {
  }

  private rootUrl = 'api/regression';

  regressions$ = this.http.get<Regression[]>(this.rootUrl)
    .pipe(
      tap(data => console.log("regresssion service", JSON.stringify(data))),
      catchError(this.errorHandler.handleError));
  saveRegressionSubject = new Subject<Regression>();
  regressionSavedAction$ = this.saveRegressionSubject.asObservable();

  saveRegression(regression?: Regression) {
    if (regression === null || regression === undefined) {
      regression = {
        actualEndDate: null,
        actualStartDate: null,
        id: 0,
        isComplete: false,
        isStarted: false,
        name: "Blank_" + new Date().toUTCString(),
        plannedEndDate: null,
        plannedStartDate: null,
        practiceName: "REGRESSION",
        releaseName: "RL_" + new Date().toLocaleDateString(),
        results: []
      }
    }
    if (regression.id) {
      this.http.put(this.rootUrl, regression).pipe(
        tap(regression => console.log(regression))
      )
    } else {
      this.http.post(this.rootUrl, regression).pipe(
        tap(regression => console.log(regression))
      )
    }
    this.saveRegressionSubject.next(regression);
  }

  regressionWithAdd$ = merge(
    this.regressions$,
    this.regressionSavedAction$
  ).pipe(
    tap(data => console.log(data)),
    scan((acc: Regression[], value: Regression) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  )
}


