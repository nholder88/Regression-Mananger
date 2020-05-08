import { Injectable } from '@angular/core';

import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { catchError, delay, map, scan, shareReplay, tap } from 'rxjs/operators';
import { TestPass } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestPassService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
  }

  rootUrl: string = `${environment.apiUrl}/TestPass`;

  testPasses$ =
    this.http.get<TestPass[]>(`${this.rootUrl}`).pipe(
      catchError(this.errorHandler.handleError)
    );

  //TODO: Make this more robust to not have to hard code string...UGH
  private testPassSelectedSubject = new BehaviorSubject<string>('');
  testPassSelectedAction$ = this.testPassSelectedSubject.asObservable();


  selectedTestPass$ = combineLatest([
    this.testPasses$,
    this.testPassSelectedAction$
  ]).pipe(
    map(([testPass, id]) => testPass.find(feat => feat.id === id))
  );


  // Change the selected Test Pass
  selectedTestPassChanged(id: string): void {
    this.testPassSelectedSubject.next(id);
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

  saveTestPass(testPass?: TestPass) {
    if (!testPass.id) {
      delete testPass.id;
    }
    const saveObservable$ = testPass.id ? this.http
      .put<TestPass>(this.rootUrl, testPass) : this.http
      .post<TestPass>(this.rootUrl, testPass);

    saveObservable$.pipe(
      catchError(err => this.errorHandler.handleError(err)))
      .subscribe(x => this.saveTestPassSubject.next(x));

  }


}
