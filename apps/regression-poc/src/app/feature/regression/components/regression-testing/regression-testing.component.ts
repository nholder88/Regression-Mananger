import {Component, OnInit} from '@angular/core';
import {TestPassService} from '../../services/testpass.service';
import {ActivatedRoute, Router} from '@angular/router';

import {ScenarioResultService} from "../../services/scenario-result.service";
import {FormArray, FormBuilder} from "@angular/forms";
import {ScenarioResult, Steps} from "@qa/api-interfaces";
import {tap} from "rxjs/operators";

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  testPass$ = this.testPassService.selectedTestPass$;
  scenarioResultData$ = this.scenarioResultService.scenarioResultForTestPass$.pipe(
    tap(x => {
  this.scenarioResultData = x;
  this.scenarioForm =  this.formBuilder.array(x);
  //this.scenarioForm.patchValue( x);
  console.log("Testing component Data on init", x, this.scenarioForm);
}));

  scenarioConfigForm;
  scenarioForm= new FormArray([]);
  scenarioResultData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testPassService: TestPassService,
    private scenarioResultService: ScenarioResultService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    let testPassId = this.route.snapshot.paramMap.get('id');
    this.scenarioResultService.selectedTestPassChanged(testPassId);

    this.scenarioConfigForm = this.formBuilder.group({testingLogin: "", tester: "", role: ""})

  }

  changeFeature(featureName) {
    this.scenarioResultService.selectedFeatureChanged(featureName);
  }

  saveScenarioResults(data) {
    this.scenarioResultService.saveResults(data)
    console.log('Scenario Results Saved.', this.scenarioConfigForm.value, this.scenarioForm.value);
  }

  completeTestRun() {
    console.log('Test Run Completed');
    this.router.navigateByUrl('/regression/listing');
  }

  toggleStepCompleted(step: Steps, result: ScenarioResult) {

  }
}
