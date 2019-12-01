import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Regression} from "@qa/api-interfaces";

@Injectable({
  providedIn: 'root'
})
export class RegressionService {

  constructor(private http) {
  }

  regressions$(): Observable<Regression[]> {

    return this.http.get('api/regression').tap(data => console.log("regresssion service", data))

  }
}
