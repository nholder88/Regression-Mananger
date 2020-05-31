import { Component, OnInit } from '@angular/core';
import { ScenarioResultService } from '../../regression/services/scenario-result.service';

@Component({
  selector: 'qa-landing',
  template: `<h2>Regression Overview</h2>

<span class="spinner spinner-inverse" *ngIf="!(reportData$ | async)">
  Loading...
</span>

<ng-container *ngIf="reportData$ | async as reportData">
  <qa-graph [gridData]="reportData"> </qa-graph>
  <qa-datatable [gridData]="reportData"></qa-datatable>
</ng-container>
`
})
export class LandingComponent implements OnInit {
  reportData$ = this.scenarioResultService.reportData$;

  constructor(private scenarioResultService: ScenarioResultService) {}

  ngOnInit(): void {}
}
