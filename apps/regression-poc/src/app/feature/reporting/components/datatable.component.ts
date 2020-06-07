import { Component, Input, OnInit } from '@angular/core';
import { ScenarioResult } from '@qa/api-interfaces';

@Component({
  selector: 'qa-datatable',
  template: `
    <div class="clr-row">
      <div class="clr-col">
        <div class="card">
          <div class="card-header">
            Test Pass Results
          </div>
          <div class="card-block">
            <div class="card-text">
              <clr-datagrid>
                <clr-dg-column [clrDgField]="'testPass.title'"
                  >Test Pass</clr-dg-column
                >
                <clr-dg-column [clrDgField]="'scenario.name'"
                  >Scenario</clr-dg-column
                >
                <clr-dg-column [clrDgField]="'timestamp'"
                  >Test Date</clr-dg-column
                >
                <clr-dg-column [clrDgField]="'status'">Status</clr-dg-column>
                <clr-dg-column [clrDgField]="'bugCreated'"
                  >Bug Created?
                </clr-dg-column>

                <clr-dg-row *clrDgItems="let result of gridData">
                  <clr-dg-cell>{{ result.testPass.title }}</clr-dg-cell>
                  <clr-dg-cell>{{ result.scenario.name }}</clr-dg-cell>
                  <clr-dg-cell>{{
                    result.timestamp | date: 'medium'
                  }}</clr-dg-cell>
                  <clr-dg-cell>{{ result.status }}</clr-dg-cell>
                  <clr-dg-cell>
                    <span *ngIf="result.bugCreated">Yes</span>
                    <span *ngIf="!result.bugCreated">No</span>
                  </clr-dg-cell>
                </clr-dg-row>
                <clr-dg-footer>
                  <clr-dg-pagination #pagination [clrDgPageSize]="10">
                    <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]"
                      >Results per page</clr-dg-page-size
                    >
                    {{ pagination.firstItem + 1 }} -
                    {{ pagination.lastItem + 1 }} of
                    {{ pagination.totalItems }} results
                  </clr-dg-pagination>
                </clr-dg-footer>
              </clr-datagrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DatatableComponent implements OnInit {
  @Input()
  gridData: ScenarioResult[];
  constructor() {}

  ngOnInit(): void {}
}
