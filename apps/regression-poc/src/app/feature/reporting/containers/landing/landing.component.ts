import { Component, OnInit } from '@angular/core';
import { ScenarioResultService } from '../../../regression/services/scenario-result.service';

@Component({
  selector: 'qa-landing',
  template: `<h2>Regression Overview</h2>
  <ng-container *ngIf="reportData$ | async as reportData;else spinner">
    <qa-graph [gridData]="reportData"></qa-graph>
    <qa-datatable [gridData]="reportData"></qa-datatable>
  </ng-container>
  <ng-template #spinner><span class="spinner spinner-inverse">
  Loading...
</span>
  </ng-template>`
})
export class LandingComponent implements OnInit {
  reportData$ = this.scenarioResultService.reportData$;

  constructor(private scenarioResultService: ScenarioResultService) {}

  ngOnInit(): void {}
}
