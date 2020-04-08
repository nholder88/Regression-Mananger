import { Injectable } from '@angular/core';
import {
  merge,
  Observable,
  of,
  Subject,
  BehaviorSubject,
  combineLatest
} from 'rxjs';
import * as faker from 'faker';
import { catchError, scan, tap, delay, map, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../Shared/error-handling.service';
import { Scenario } from './models/scenario';
import { FeatureScenarioContainer } from './models/FeatureScenarioContainer';
import { Steps } from './models/Steps';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  private rootUrl = 'api/scenario';

  // scenarios$ = this.http.get<scenario[]>(this.rootUrl)
  scenarios$ = of<Scenario[]>(
    this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
  ).pipe(
    delay(700),
    tap(data => console.log('Scenario service', JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );
  savescenarioSubject = new Subject<Scenario>();
  scenarioSavedAction$ = this.savescenarioSubject.asObservable();

  scenarioWithAdd$ = merge(this.scenarios$, this.scenarioSavedAction$).pipe(
    tap(data => console.log(data)),
    scan((acc: Scenario[], value: Scenario) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  saveScenario(scenario?: Scenario) {
    if (scenario === null || scenario === undefined) {
      scenario = new Scenario(
        faker.commerce.department(),
        faker.name.jobArea(),
        null,
        this.createFakeStep(faker.random.number(25)),
        new Date(),
        ''
      );
    }
    if (scenario.id.length > 0) {
      this.http
        .put(this.rootUrl, scenario)
        // tslint:disable-next-line:no-shadowed-variable
        .pipe(tap(scenario => console.log(scenario)))
        .subscribe();
    } else {
      this.http
        .post(this.rootUrl, scenario)
        // tslint:disable-next-line:no-shadowed-variable
        .pipe(tap(scenario => console.log(scenario)))
        .subscribe();
    }
    this.savescenarioSubject.next(scenario);
  }

  public createFakeScenario(count: number) {
    const steps = [];
    let x: number;
    for (x = 0; x < count; x++) {
      const step = new Scenario(
        faker.commerce.department(),
        faker.hacker.abbreviation(),
        null,
        this.createFakeStep(faker.random.number(25)),
        new Date(),
        '',
        faker.random.number(),
        faker.name.findName()
      );
      step.steps.sort((x, y) => x.order - y.order);
      steps.push(step);
    }

    return steps;
  }
  public createFakeStep(count: number) {
    const steps = [];
    let x: number;
    for (x = 0; x < count; x++) {
      const step = new Steps(faker.lorem.sentences(3), faker.random.number(25));
      steps.push(step);
    }

    return steps;
  }
}
