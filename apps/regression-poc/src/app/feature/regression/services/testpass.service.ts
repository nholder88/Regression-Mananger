import { Injectable } from '@angular/core';

import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { catchError, scan } from 'rxjs/operators';
import { TestPass } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseModelService } from '../../../../Shared/services/baseService';

@Injectable({
  providedIn: 'root'
})
export class TestPassService extends BaseModelService<TestPass> {
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
  ) {
    super(httpClient, errorHandlerService, 'TestPass', '?join=Header');

  }

  private testPassSelectedSubject = new BehaviorSubject<TestPass>(null);
  testPassSelectedAction$ = this.testPassSelectedSubject.asObservable();

  selectedTestPass$ = this.testPassSelectedAction$;

  saveTestPassSubject = new Subject<TestPass>();
  testPassSavedAction$ = this.saveTestPassSubject.asObservable();

  testPassesWithAdd$ = merge(this.models$, this.testPassSavedAction$).pipe(
    scan((acc: TestPass[], value: TestPass) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  // Change the selected Test Pass
  selectedTestPassChanged(id: string): void {
    // Get the test pass from the API with the test results and scenarios
    if (id) {
      // get the scenario results with this test pass
      this.http
        .get<TestPass>(this.rootUrl + `/${id}?join=results`)
        .pipe(catchError(err => this.errorHandler.handleError(err)))
        .subscribe(testPass => this.testPassSelectedSubject.next(testPass));
    }
  }


  completeTestPass(testPassId: string) {
    // because the reload is trigger when this is called there is no need to emit
    this.http
      .patch<TestPass>(`${this.rootUrl}/${testPassId}`, { isComplete: true })
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe();
  }
}
