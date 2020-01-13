import {Injectable} from '@angular/core';
import {merge, Observable, of, Subject} from "rxjs";
import {Area, Regression, User} from "@qa/api-interfaces";
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
  );

  areas$:Observable<Area[]> =of<Area[]>(
    [{
      id:0, name:"Chart",
      features:
        [{
          id: 0,
          name: "Letters", enable:false,
          teams: [{id: 0, name: "OU"}],
          subFeatures: [
            {id: 0, name: "Faxing",  teams: [{id: 0, name: "OU"}],  enable:false,  subFeatures: [ {id: 0, name: "Re-faxing",  teams: [{id: 0, name: "OU"}],  enable:false,   subFeatures: null}]},
            {id: 1, name: "Signing",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
            {id: 2, name: "Generation", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null},
            {id: 3, name: "Saving", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null},
            {id: 4, name: "Deleting",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
            {id: 5, name: "Re-signing", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null}]
        }]},
      {
        id: 0,
        name: "CQM",
        features: [
          {id: 0, name: "Calculation",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
          {id: 0, name: "Medical Lookups",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
          {id: 0, name: "Presentation",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
          {id: 0, name: "Performance",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
        ]
      },
      {
        id: 0,
        name: "Custom Integrations",
        features: [
          {id: 0, name: "Northwell Tasking",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 0, name: "HIE",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 0, name: "Northwell HL7", enable:false,  teams: [{id: 0, name: "OD"}],subFeatures: null},
        ]
      }]);
}


