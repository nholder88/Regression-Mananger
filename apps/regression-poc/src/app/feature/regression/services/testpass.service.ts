import { Injectable } from '@angular/core';

import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { catchError, scan } from 'rxjs/operators';
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

  testPasses$ = this.http
    .get<TestPass[]>(`${this.rootUrl}?join=Header`)
    .pipe(catchError(this.errorHandler.handleError));


  private testPassSelectedSubject = new BehaviorSubject<TestPass>(null);
  testPassSelectedAction$ = this.testPassSelectedSubject.asObservable();

  selectedTestPass$ = this.testPassSelectedAction$;

  saveTestPassSubject = new Subject<TestPass>();
  testPassSavedAction$ = this.saveTestPassSubject.asObservable();

  testPassesWithAdd$ = merge(this.testPasses$, this.testPassSavedAction$).pipe(
    scan((acc: TestPass[], value: TestPass) =>   [...acc, value] ),
    catchError(err => this.errorHandler.handleError(err))
  );

  // Change the selected Test Pass
  selectedTestPassChanged(id: string): void {
    // Get the test pass from the API with the test results and scenarios
    if (id) {
      // get the scenario results with this test pass
      this.http
        .get<TestPass>(
          this.rootUrl + `/${id}?join=results`
        )
        .pipe(catchError(err => this.errorHandler.handleError(err)))
        .subscribe(testPass => this.testPassSelectedSubject.next(testPass));
    }
  }

  saveTestPass(testPass?: TestPass) {
    if (!testPass.id) {
      delete testPass.id;
    }
    const saveObservable$ = testPass.id
      ? this.http.put<TestPass>(this.rootUrl, testPass)
      : this.http.post<TestPass>(this.rootUrl, testPass);

    saveObservable$
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe(x => this.saveTestPassSubject.next(x));

  }

  completeTestPass(testPassId: string) {

    // because the reload is trigger when this is called there is no need to emit
    this.http.patch<TestPass>(`${this.rootUrl}/${testPassId}`, { isComplete: true })
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe();


  }
}
