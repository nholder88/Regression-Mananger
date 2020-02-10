import { Injectable } from '@angular/core';
import { TestPass } from './models/scenario';
import { ErrorHandlingService } from 'apps/regression-poc/src/Shared/error-handling.service';
import { of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import * as faker from 'faker';

@Injectable({
  providedIn: 'root'
})
export class TestPassService {
  constructor(private errorHandler: ErrorHandlingService) {}

  testPasses$ = of<TestPass[]>(
    this.createFakeTestPasses(faker.random.number({ min: 1, max: 45 }))
  ).pipe(
    delay(700),
    tap(data => console.log('Scenario service', JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );

  createFakeTestPasses(count: number) {
    const steps = [];
    let x: number;
    for (x = 0; x < count; x++) {
      const step = new TestPass(
        [],
        faker.name.findName(),
        faker.date.recent(1),
        faker.random.boolean(),
        faker.random.boolean(),
        faker.random.uuid()
      );
      //step.steps.sort((x, y) => x.order - y.order);
      steps.push(step);
    }

    return steps;
  }
}
