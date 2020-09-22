import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { Scenario } from '@qa/api-interfaces';

@Component({
  selector: 'qa-scenario-listing',
  templateUrl: 'scenario-listing.component.html'
})
export class ScenarioListingComponent implements OnInit {
  scenarios$ = this.scenarioService.modelWithDelete$;

  constructor(private scenarioService: ScenarioService) {}

  deleteScenario(scenario: Scenario) {
    this.scenarioService.deleteModel(scenario.id);
  }

  selectScenario(scenario: Scenario) {
    this.scenarioService.selectedModelChanged(scenario.id);
  }
  ngOnInit() {
    this.scenarioService.selectedModelChanged(null);
  }
}
