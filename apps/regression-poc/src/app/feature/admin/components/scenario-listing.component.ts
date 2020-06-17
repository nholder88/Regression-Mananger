import { Component } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { Scenario } from '@qa/api-interfaces';

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
                    <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>

                    <clr-dg-column>Number of Steps</clr-dg-column>
                    <clr-dg-column></clr-dg-column>
                    <clr-dg-placeholder
                    >We couldn't find any scenarios!
                    </clr-dg-placeholder
                    >
                    <clr-dg-row *ngFor="let scenario of scenarios$ | async">
                      <clr-dg-cell
                      >{{ scenario?.feature?.name }} ({{
                        scenario?.feature?.team
                        }})
                      </clr-dg-cell
                      >
                      <clr-dg-cell>{{ scenario.name }}</clr-dg-cell>
                      <clr-dg-cell>{{ scenario.steps?.length }}</clr-dg-cell>
                      <clr-dg-cell>
                        <button
                          class="btn btn-sm btn-outline"
                          type="button"
                          (click)="selectScenario(scenario)"

                        >
                          <clr-icon shape="pencil"></clr-icon>
                          Edit
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          (click)="deleteScenario(scenario)"
                        >
                          <clr-icon shape="trash"></clr-icon>
                          Remove
                        </button>
                      </clr-dg-cell
                      >
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
  scenarios$ = this.scenarioService.scenarioWithDelete$;

  constructor(private scenarioService: ScenarioService) {
  }

  deleteScenario(scenario: Scenario) {
    this.scenarioService.deleteScenario(scenario.id);
  }

  selectScenario(scenario: Scenario) {
    this.scenarioService.selectedScenarioChanged(scenario.id);

  }
}
