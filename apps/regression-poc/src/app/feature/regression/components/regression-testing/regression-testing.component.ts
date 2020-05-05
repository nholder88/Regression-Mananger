import {Component, OnInit} from '@angular/core';
import {TestPassService} from '../../services/testpass.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ScenarioService} from "../../services/scenario.service";

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  testPass$ = this.testPassService.selectedTestPass$;
  selectedFeatureScenarios$ = this.scenarioService.selectedFeatureScenarios$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testPassService: TestPassService,
    private scenarioService: ScenarioService
  ) {
  }

  ngOnInit() {
    //need to read router id and make call out to service to get the data
    let testPassId = this.route.snapshot.paramMap.get('id');

    this.testPassService.selectedTestPassChanged(testPassId);

  }

  changeFeature(featureName) {
    this.scenarioService.selectedFeatureChanged(featureName);
  }

  saveScenarioResults() {
    console.log('Scenario Results Saved.');
  }

  completeTestRun() {
    console.log('Test Run Completed');
    this.router.navigateByUrl('/regression/listing');
  }
}
