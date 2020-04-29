import { Injectable } from '@angular/core';

import { ErrorHandlingService } from '../../../Shared/services/error-handling.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, delay, map, shareReplay, tap } from 'rxjs/operators';
import * as faker from 'faker';
import { ScenarioService } from './scenario.service';
import { FeatureScenarioContainer, TestPass } from '@qa/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class TestPassService {
  constructor(
    private errorHandler: ErrorHandlingService,
    private scenarioService: ScenarioService
  ) {}

  testPasses$ = of<TestPass[]>(
    this.createFakeTestPasses(faker.random.number({ min: 1, max: 45 }))
  ).pipe(
    delay(700),
    tap(data => console.log('Scenario service', JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );

  //TODO: Make this more robust to not have to hard code string...UGH
  private testPassSelectedSubject = new BehaviorSubject<string>('');
  testPassSelectedAction$ = this.testPassSelectedSubject.asObservable();

  // Currently selected product
  // Used in both List and Detail pages,
  // so use the shareReply to share it with any component that uses it
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

  // Change the selected product
  selectedFeatureChanged(selectedFeatureName: string): void {
    this.featureSelectedSubject.next(selectedFeatureName);
  }

  saveTestPass(testPass:TestPass){
    if(testPass.id.length > 0){}
  }

  createFakeTestPasses(count: number) {
    const steps = [];
    let x: number;
    for (x = 0; x < count; x++) {
      const step = new TestPass(
        [
          new FeatureScenarioContainer(
            faker.company.catchPhraseNoun(),
            this.scenarioService.createFakeScenario(
              faker.random.number({ min: 1, max: 45 })
            )
          ),
          new FeatureScenarioContainer(
            faker.company.catchPhraseNoun(),
            this.scenarioService.createFakeScenario(
              faker.random.number({ min: 1, max: 45 })
            )
          ),
          new FeatureScenarioContainer(
            faker.company.catchPhraseNoun(),
            this.scenarioService.createFakeScenario(
              faker.random.number({ min: 1, max: 45 })
            )
          ),
          new FeatureScenarioContainer(
            faker.company.catchPhraseNoun(),
            this.scenarioService.createFakeScenario(
              faker.random.number({ min: 1, max: 45 })
            )
          ),
          new FeatureScenarioContainer(
            faker.company.catchPhraseNoun(),
            this.scenarioService.createFakeScenario(
              faker.random.number({ min: 1, max: 45 })
            )
          )
        ],
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
