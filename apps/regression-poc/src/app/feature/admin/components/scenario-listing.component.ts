import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';

@Component({
  selector: 'qa-scenario-listing',
  template: `
    <div class="clr-row">
      <div class="clr-col-12">
        <div class="card">
          <div class="card-header">Scenarios</div>
          <div class="card-block">
            <div class="card-text">
              <div class="clr-row">
                <div class="clr-col-md">
                  <clr-datagrid>
                    <clr-dg-column [clrDgField]="'feature.name'"
                      >Feature</clr-dg-column
                    >
                    <clr-dg-column [clrDgField]="'name'">Name </clr-dg-column>

                    <clr-dg-column>Number of Steps</clr-dg-column>
                    <clr-dg-placeholder
                      >We couldn't find any scenarios!</clr-dg-placeholder
                    >
                    <clr-dg-row *ngFor="let scenario of scenarios$ | async">
                      <clr-dg-cell
                        >{{ scenario?.feature?.name }} ({{
                          scenario?.feature?.team
                        }})</clr-dg-cell
                      >
                      <clr-dg-cell>{{ scenario.name }}</clr-dg-cell>
                      <clr-dg-cell>{{ scenario.steps?.length }}</clr-dg-cell>
                    </clr-dg-row>
                  </clr-datagrid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ScenarioListingComponent {
  constructor(private scenarioService: ScenarioService) {}
  scenarios$ = this.scenarioService.scenarioWithAdd$;
}
