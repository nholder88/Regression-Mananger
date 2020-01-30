import { Component, OnInit } from '@angular/core';
import { RegressionService } from '../regression.service';

import { Scenario } from '../models/scenario';
import { ScenarioService } from '../scenario.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  regression$ = this.service.regressionWithAdd$;

  scenarios$: Observable<Array<Scenario>> = this.scenarioService.scenarioWithAdd$;

  constructor(
    private service: RegressionService,
    private scenarioService: ScenarioService
  ) {}

  ngOnInit() {

  }
}
