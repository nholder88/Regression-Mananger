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
import { Scenario, Steps, FeatureScenarioContainer } from './models/scenario';

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

  features$ = of<FeatureScenarioContainer[]>([
    new FeatureScenarioContainer(
      'Letters',
      this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
    ),
    new FeatureScenarioContainer(
      'Faxing',
      this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
    ),
    new FeatureScenarioContainer(
      'Meds',
      this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
    ),
    new FeatureScenarioContainer(
      'Shared Care',
      this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
    ),
    new FeatureScenarioContainer(
      'ASC',
      this.createFakeScenario(faker.random.number({ min: 1, max: 45 }))
    )
  ]);

  // Action stream for product selection
  // Default to 0 for no product
  // Must have a default so the stream emits at least once.
  //TODO: Make this more robust to not have to hard code string...UGH
  private featureSelectedSubject = new BehaviorSubject<string>('Letters');
  featureSelectedAction$ = this.featureSelectedSubject.asObservable();

  // Currently selected product
  // Used in both List and Detail pages,
  // so use the shareReply to share it with any component that uses it
  selectedFeature$ = combineLatest([
    this.features$,
    this.featureSelectedAction$
  ]).pipe(
    map(([feature, selectedFeatureName]) =>
      feature.find(feat => feat.feature === selectedFeatureName)
    ),
    tap(feature => console.log('selectedProduct', feature)),
    shareReplay(1)
  );

  // Change the selected product
  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }

  savescenario(scenario?: Scenario) {
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
