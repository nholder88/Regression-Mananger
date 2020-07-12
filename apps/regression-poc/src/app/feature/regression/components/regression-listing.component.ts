import { Component } from '@angular/core';
import { RegressionHeaderService } from '../services/regression-header.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegressionHeader } from '@qa/api-interfaces';


@Component({
  selector: 'qa-regression-listing',
  template: `

    <div class="card" *ngIf="vm$ | async as vm; else spinner">
      <div class="card-header">
        History
        <button class="btn btn-sm btn-primary add-regression-button" (click)="  addNewRegression()">
          Add Regression
        </button>
      </div>
      <div class="card-block">
        <div class="card-title">
          Active Regressions
        </div>
        <div
          class="card-text"
          *ngIf="vm.ActiveRegressions || vm.CompletedRegressions"
        >
          <clr-datagrid [(clrDgSingleSelected)]="selected">
            <clr-dg-column>Name</clr-dg-column>
            <clr-dg-column>Start Date</clr-dg-column>
            <clr-dg-column>End Date</clr-dg-column>

            <clr-dg-column>Test Runs</clr-dg-column>
            <clr-dg-column>Actions </clr-dg-column>

            <clr-dg-row
              *clrDgItems="let regression of vm.ActiveRegressions"
              [clrDgItem]="regression"
            >
              <clr-dg-cell>{{ regression.name }}</clr-dg-cell>
              <clr-dg-cell>{{ regression.startDate | date }}</clr-dg-cell>
              <clr-dg-cell>{{ regression.endDate | date }}</clr-dg-cell>
              <clr-dg-cell>
                <span *ngIf="!regression.testPasses">No test passes</span>
                <span *ngIf="regression.testPasses">
                  {{ regression?.testPasses?.length }}</span
                >
              </clr-dg-cell>

              <clr-dg-cell>
                <button class="btn btn-sm btn-primary" (click)="editRegression(regression)">
                  Edit Regression
                </button>

                <button
                  class="btn btn-sm btn-info"
                  (click)="completeRegression(regression)"
                >
                  Complete Regression
                </button>

              </clr-dg-cell>
            </clr-dg-row>

            <clr-dg-footer
              >{{ vm.ActiveRegressions?.length }} Regression Cycle(s)
            </clr-dg-footer>
          </clr-datagrid>
        </div>

        <div class="card-title">
          Completed Regressions
        </div>
        <div class="card-text" *ngIf="vm.CompletedRegressions">
          <clr-datagrid>
            <clr-dg-column>Name</clr-dg-column>
            <clr-dg-column>Release</clr-dg-column>
            <clr-dg-column>Start Date</clr-dg-column>

            <clr-dg-column>End Date</clr-dg-column>

            <clr-dg-column></clr-dg-column>

            <clr-dg-row *clrDgItems="let regression of vm.CompletedRegressions">
              <clr-dg-cell>{{ regression.name }}</clr-dg-cell>
              <clr-dg-cell>{{ regression.releaseName }}</clr-dg-cell>
              <clr-dg-cell>{{ regression.startDate | date }}</clr-dg-cell>

              <clr-dg-cell>{{ regression.endDate | date }}</clr-dg-cell>

              <clr-dg-cell>
                <button
                  class="btn btn-info-outline btn-sm"
                  (click)="onViewResultsClick(regression)"
                >
                  View Results
                </button>
              </clr-dg-cell>
            </clr-dg-row>

            <clr-dg-footer
              >{{ vm.CompletedRegressions?.length }} Regression Cycle(s)
            </clr-dg-footer>
          </clr-datagrid>
        </div>
        <div
          class="card-text"
          *ngIf="!vm.ActiveRegressions || !vm.CompletedRegressions"
        >
          No Regressions have been started.
        </div>
      </div>
    </div>
    <ng-template #spinner> <span class="spinner"  >
      Loading...
    </span></ng-template>


    <qa-regression-header-modal
    > </qa-regression-header-modal>
  `,
  styles: [
    `
      .add-regression-button {
        float: right;
      }
    `
  ]
})
export class RegressionListingComponent {
  constructor(private service: RegressionHeaderService) {}

  regression$ = this.service.modelWithDelete$;
  selected;

  vm$ = combineLatest([this.regression$]).pipe(
    map(([regressions]) => ({

      ActiveRegressions: Array.isArray(regressions)?regressions.filter(x => x.isComplete === false):[],
      CompletedRegressions:Array.isArray(regressions)? regressions.filter(r => r.isComplete === true):[]
    }))
  );



  onViewResultsClick(regression) {
    window.open(
      'https://valor-software.com/ng2-charts/#/GeneralInfo',
      '_blank'
    );
  }

  completeRegression(regression: RegressionHeader) {
    regression.isComplete = true;
    this.service.saveModel(regression);
  }

  editRegression(regression: RegressionHeader) {
    this.service.selectedModelChanged(regression.id)
    this.service.modalOpenStateChange(true);


  }

  addNewRegression() {
    this.service.selectedModelChanged(null);
    this.service.modalOpenStateChange(true);
  }
}
