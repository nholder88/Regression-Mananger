import { Component, OnInit } from '@angular/core';

import { RegressionService } from '../regression.service';

import { Scenario, FeatureScenarioContainer } from '../models/scenario';
import { ScenarioService } from '../scenario.service';
import { Observable } from 'rxjs';
import { TestPassService } from '../testpass.service';

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  regression$ = this.service.regressionWithAdd$;
  testPasses$ = this.testPassService.testPasses$;
  scenarios$ = this.scenarioService.selectedFeature$;
  featureContainers: FeatureScenarioContainer[] = [
    new FeatureScenarioContainer('Letters', []),
    new FeatureScenarioContainer('Faxing', []),
    new FeatureScenarioContainer('Meds', []),
    new FeatureScenarioContainer('Shared Care', []),
    new FeatureScenarioContainer('ASC', [])
  ];

  constructor(
    private service: RegressionService,
    private scenarioService: ScenarioService,
    private testPassService: TestPassService
  ) {}

  ngOnInit() {}
  changeFeature(featureName) {
    this.SaveScenarios();
    this.scenarioService.selectedFeatureChanged(featureName);
  }
  SaveScenarios() {
    console.log('Scenarios Saved.');
  }
}
