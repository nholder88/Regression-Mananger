import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../../services/testpass.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ScenarioResultService } from '../../services/scenario-result.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { ScenarioResult, Steps } from '@qa/api-interfaces';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  testPass$ = this.testPassService.selectedTestPass$;
  scenarioResultData$ = this.scenarioResultService.scenarioResultForTestPass$;
  scenarioConfigForm;
  scenarioForm = new FormArray([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testPassService: TestPassService,
    private scenarioResultService: ScenarioResultService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    let testPassId = this.route.snapshot.paramMap.get('id');
    this.scenarioResultService.selectedTestPassChanged(testPassId);
    this.scenarioConfigForm = this.formBuilder.group({
      testingLogin: '',
      tester: '',
      role: ''
    });
  }

  changeFeature(featureName) {
    this.scenarioResultService.selectedFeatureChanged(featureName);
    this.scenarioResultData$.subscribe(x => {
      return (this.scenarioForm = x);
    });
  }

  saveScenarioResults() {
    //Todo: Map each item to take the config data and update the property as needed.
    this.scenarioResultService.saveResults(this.scenarioForm.value);
  }

  completeTestRun() {
    this.router.navigateByUrl('/regression/listing');
  }
  /*todo: Create the unsubscribe here*/
  toggleStepCompleted(step: Steps, result: ScenarioResult) {}
}
