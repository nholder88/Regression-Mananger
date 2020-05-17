import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { RegressionHeader } from '@qa/api-interfaces';
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

  private rootUrl = `${environment.apiUrl}/header`;

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
    scan((acc: RegressionHeader[], value: RegressionHeader) => {
      var returnedHeaderIndex = acc.indexOf(value);
      if (returnedHeaderIndex > -1) {
        acc.splice(returnedHeaderIndex, 1, value);
        return acc;
      } else {
        return [...acc, value];
      }
    }),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveRegression(regression?: RegressionHeader) {
    if (!regression.id) {
      regression.testPasses = [];
      delete regression.id;
    }
    const saveObservable$ = regression.id ? this.http
      .patch<RegressionHeader>(`${this.rootUrl}/${regression.id}`, regression) : this.http
      .post<RegressionHeader>(this.rootUrl, regression);

    saveObservable$.pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe(reg => this.saveRegressionSubject.next(reg));

  }


}
