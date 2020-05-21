import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../../services/testpass.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-regression-test-pass-listing',
  template: `
    <div class="row">
      <div class="clr-col">
        <h2>
          My Test Passes
          <qa-regression-test-pass-form></qa-regression-test-pass-form>
        </h2>
        <clr-spinner  *ngIf="!(testPasses$|async)"></clr-spinner>

        <clr-datagrid *ngIf="testPasses$|async as testPasses">
          <clr-dg-column [clrDgField]="'title'">Name</clr-dg-column>
          <clr-dg-column  [clrDgField]="'Header.name'">Regression</clr-dg-column>
          <clr-dg-column [clrDgField]="'timeStamp'">Create Date</clr-dg-column>
          <clr-dg-column [clrDgField]="'creator'">Creator</clr-dg-column>
          <clr-dg-column [clrDgField]="'featureScenarioContainers.length'">Test Runs</clr-dg-column>
          <clr-dg-column>Actions</clr-dg-column>

          <clr-dg-row
            *clrDgItems="let testPass of testPasses  "
            [clrDgItem]="testPass"
          >
            <clr-dg-cell>{{testPass.title }}</clr-dg-cell>
            <clr-dg-cell>{{testPass.Header?.name}}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.timeStamp | date: 'short' }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.creator }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.featureScenarioContainers.length }}</clr-dg-cell>
            <clr-dg-cell>
              <a
                class="btn btn-sm btn-secondary"
                [routerLink]="['/regression/continue', testPass.id]"
              >Continue</a
              >
            </clr-dg-cell>
          </clr-dg-row>

          <clr-dg-footer
          >{{testPasses?.length }} Test Pass(es)
          </clr-dg-footer
          >
        </clr-datagrid>

      </div>
    </div>`
})
export class RegressionTestPassListingComponent implements OnInit {

  testPasses$ = this.testPass.testPassesWithAdd$.pipe(
    map(x => x.filter(s => !s.Header?.isComplete))
  );

  constructor(private testPass: TestPassService) {
  }

  ngOnInit() {
  }

}
