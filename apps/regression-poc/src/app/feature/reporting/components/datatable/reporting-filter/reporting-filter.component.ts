import { Component, OnInit } from '@angular/core';
import { ScenarioResult } from '@qa/api-interfaces';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { RegressionHeaderService } from '../../../../regression/services/regression-header.service';
import { ScenarioResultService } from '../../../../regression/services/scenario-result.service';
import { ScenarioService } from '../../../../regression/services/scenario.service';

@Component({
  selector: 'qa-reporting-filter',
  template: `

    <clr-checkbox-container >
      <clr-checkbox-wrapper *ngFor="let header of scenarios$ |async">
        <input type="checkbox" clrCheckbox [value]="header" [name]="header.name" />
        <label>{{header.name}}</label>
      </clr-checkbox-wrapper>

    </clr-checkbox-container>
  `
})
export class ReportingFilterComponent implements ClrDatagridFilterInterface<ScenarioResult> {

  scenarios$= this.scenarioService.modelWithDelete$;
  constructor(private filterContainer: ClrDatagridFilter, private scenarioService:ScenarioService) {
    filterContainer.setFilter(this);
  }

  changes = new Subject<any>();

  accepts(item: ScenarioResult): boolean {
    return false;
  }

  isActive(): boolean {
    return false;
  }

}
