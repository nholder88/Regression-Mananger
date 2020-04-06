import { Component, OnInit } from '@angular/core';
import { RegressionService } from '../regression.service';
import { ScenarioService } from '../scenario.service';
import { TestPassService } from '../testpass.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  testPass$ = this.testPassService.selectedTestPass$;
  selectedFeature$ = this.scenarioService.selectedFeature$;
  features$ = this.scenarioService.features$;

  constructor(
    private service: RegressionService,
    private scenarioService: ScenarioService,
    private route: ActivatedRoute,
    private router: Router,
    private testPassService: TestPassService
  ) {}

  ngOnInit() {
    //need to read router id and make call out to service to get the data
    let testPassId = this.route.snapshot.paramMap.get('id');
    this.testPassService.selectedTestPassChanged(testPassId);
    console.log(this.testPass$);
  }
  changeFeature(featureName) {
    this.saveScenarios();
    this.scenarioService.selectedFeatureChanged(featureName);
  }
  saveScenarios() {
    console.log('Scenarios Saved.');
  }
  completeTestRun() {
    console.log('Test Run Completed');
    this.router.navigateByUrl('/regression/listing');
  }
}
