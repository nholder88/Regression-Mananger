import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {RegressionEntity} from "@qa/api-interfaces";
import {throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegressionService {

  constructor(private http:HttpClient) {
  }

  private regressionURL = 'api/regression';

  regressions$= this.http.get<RegressionEntity[]>(this.regressionURL)
      .pipe(
      tap(data => console.log("regresssion service", JSON.stringify(data))),
      catchError(this.handleError));


  private handleError(err: any) {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}

