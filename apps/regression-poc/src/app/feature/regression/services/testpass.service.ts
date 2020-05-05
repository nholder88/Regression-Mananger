import { Injectable } from '@angular/core';

import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { catchError, delay, map, scan, shareReplay, tap } from 'rxjs/operators';
import { ScenarioService } from './scenario.service';
import { TestPass } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestPassService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService,
    private scenarioService: ScenarioService
  ) {}
  rootUrl:string= `${environment.apiUrl }/TestPass`;

  testPasses$ =
  this.http.get<TestPass[]>(`${this.rootUrl}`).pipe(
    delay(700),
    tap(data => console.log('Scenario service', JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );

  //TODO: Make this more robust to not have to hard code string...UGH
  private testPassSelectedSubject = new BehaviorSubject<string>('');
  testPassSelectedAction$ = this.testPassSelectedSubject.asObservable();


  selectedTestPass$ = combineLatest([
    this.testPasses$,
    this.testPassSelectedAction$
  ]).pipe(
    map(([testPass, id]) => testPass.find(feat => feat.id === id)),

    tap(feature => console.log('selectedProduct', feature)),
    shareReplay(1)
  );

  //TODO: Make this more robust to not have to hard code string...UGH
  private featureSelectedSubject = new BehaviorSubject<string>('Letters');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();

  // Currently selected product
  // Used in both List and Detail pages,
  // so use the shareReply to share it with any component that uses it
  selectedFeature$ = combineLatest([
    this.selectedTestPass$,
    this.featureSelectedAction$
  ]).pipe(
    map(([testPass, selectedFeatureName]) =>
      testPass.featureScenarioContainers.find(
        tp => tp.name === selectedFeatureName
      )
    ),
    tap(feature => console.log('selectedProduct', feature)),
    shareReplay(1)
  );

  // Change the selected product
  selectedTestPassChanged(id: string): void {
    this.testPassSelectedSubject.next(id);
  }


  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }



  saveTestPassSubject = new Subject<TestPass>();
  testPassSavedAction$ = this.saveTestPassSubject.asObservable();

  testPassesWithAdd$ = merge(
    this.testPasses$,
    this.testPassSavedAction$
  ).pipe(
    scan((acc: TestPass[], value: TestPass) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveTestPass(testPass?:TestPass) {
    if (!testPass.id) {
       delete testPass.id;
    }
    const saveObservable$ = testPass.id ? this.http
      .put(this.rootUrl, testPass) : this.http
      .post(this.rootUrl, testPass);

    saveObservable$.pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe();
    this.saveTestPassSubject.next(testPass);
  }



}
