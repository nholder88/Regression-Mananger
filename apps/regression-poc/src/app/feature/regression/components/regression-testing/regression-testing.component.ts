import {Component, OnInit} from '@angular/core';
import {TestPassService} from '../../services/testpass.service';
import {ActivatedRoute, Router} from '@angular/router';

import {ScenarioResultService} from "../../services/scenario-result.service";
import {FormBuilder} from "@angular/forms";
import {ScenarioResult, Steps} from "@qa/api-interfaces";

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  testPass$ = this.testPassService.selectedTestPass$;
  scenarioResultData$ = this.scenarioResultService.scenarioResultForTestPass$;
  scenarioForm;
  scenarioConfigForm;


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
    this.scenarioForm = this.scenarioResultService.getScenarioForm();
  }

  changeFeature(featureName) {
    this.scenarioResultService.selectedFeatureChanged(featureName);
  }

  saveScenarioResults(data) {
    this.scenarioResultService.saveResults(data)
    console.log('Scenario Results Saved.');
  }

  completeTestRun() {
    console.log('Test Run Completed');
    this.router.navigateByUrl('/regression/listing');
  }

  toggleStepCompleted(step: Steps, result: ScenarioResult) {

  }
}
