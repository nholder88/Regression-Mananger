import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../services/testpass.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-regression-test-pass-listing',
  template: `
    <div class="row">
      <div class="clr-col">
        <h2>
          Current Test Passes
          <qa-regression-test-pass-form></qa-regression-test-pass-form>
        </h2>


        <clr-datagrid *ngIf="testPasses$ | async as testPasses;else spinner">
          <clr-dg-column [clrDgField]="'title'">Name</clr-dg-column>
          <clr-dg-column [clrDgField]="'Header.name'">Regression</clr-dg-column>
          <clr-dg-column [clrDgField]="'Header.name'">Test Role</clr-dg-column>
          <clr-dg-column [clrDgField]="'Header.name'"
            >Test Username</clr-dg-column
          >
          <clr-dg-column [clrDgField]="'timeStamp'">Create Date</clr-dg-column>

          <clr-dg-column [clrDgField]="'featureScenarioContainers.length'"
            >Test Runs</clr-dg-column
          >
          <clr-dg-column>Actions</clr-dg-column>

          <clr-dg-row
            *clrDgItems="let testPass of testPasses"
            [clrDgItem]="testPass"
          >
            <clr-dg-cell>{{ testPass.title }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.Header?.name }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.testingRole }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.testingLoginUserName }}</clr-dg-cell>
            <clr-dg-cell>{{ testPass.timeStamp | date: 'short' }}</clr-dg-cell>

            <clr-dg-cell>{{
              testPass.featureScenarioContainers.length
            }}</clr-dg-cell>
            <clr-dg-cell>
              <a
                class="btn btn-sm btn-secondary"
                [routerLink]="['/regression/continue', testPass.id]"
                >Continue</a
              >
            </clr-dg-cell>
          </clr-dg-row>

          <clr-dg-footer>{{ testPasses?.length }} Test Pass(es) </clr-dg-footer>
        </clr-datagrid>

        <ng-template #spinner>  <clr-spinner ></clr-spinner>
        </ng-template>
      </div>
    </div>
  `
})
export class RegressionTestPassListingComponent   {
  testPasses$ = this.testPass.modelWithDelete$.pipe(
    map(x => Array.isArray(x)? x.filter(s => !s.Header?.isComplete && !s.isComplete):[])
  );
  constructor(private testPass: TestPassService) {}

}
