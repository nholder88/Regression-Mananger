import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Regression} from "@qa/api-interfaces";
import {throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../Shared/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class RegressionService {

  constructor(private http:HttpClient,private errorHandler:ErrorHandlingService) {
  }

  private regressionURL = 'api/regression';

  regressions$= this.http.get<Regression[]>(this.regressionURL)
      .pipe(
      tap(data => console.log("regresssion service", JSON.stringify(data))),
      catchError(this.errorHandler.handleError));


}

