import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../services/testpass.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ScenarioResultService } from '../services/scenario-result.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { ScenarioResult, Steps } from '@qa/api-interfaces';

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
  currentTestPassId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testPassService: TestPassService,
    private scenarioResultService: ScenarioResultService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.currentTestPassId = this.route.snapshot.paramMap.get('id');
    this.scenarioResultService.selectedTestPassChanged(this.currentTestPassId);
    this.scenarioConfigForm = this.formBuilder.group({
      testingLogin: '',
      tester: '',
      role: ''
    });
  }

  changeFeature(featureName) {
    this.scenarioResultService.selectedTestPassChanged(this.currentTestPassId);
    this.scenarioResultService.selectedFeatureChanged(featureName);
    this.scenarioResultData$.subscribe(x => {
      return (this.scenarioForm = x);
    });
  }

  saveScenarioResults(currentFeature=null) {
    this.scenarioResultService.saveResults(this.scenarioForm.value);
    if(currentFeature){
    this.scenarioResultService.selectedFeatureChanged(currentFeature);}
  }

  completeTestRun() {
    if (this.scenarioForm.value) {
      this.saveScenarioResults();
    }
    this.testPassService.completeTestPass(this.currentTestPassId);
    this.router.navigateByUrl('/regression/listing');
  }
  /*todo: Create the unsubscribe here*/
  toggleStepCompleted(step: Steps, result: ScenarioResult) {}
}
