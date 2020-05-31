import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../../regression/services/feature.service';

@Component({
  selector: 'qa-feature-listing',
  template: `
    <div class="clr-row">
      <div class="clr-col-12">
        <div class="card">
          <div class="card-header">Features</div>
          <div class="card-block">
            <div class="card-text">
              <div class="clr-row">
                <div class="clr-col-md">
                  <clr-datagrid>
                    <clr-dg-column [clrDgField]="'name'">Name </clr-dg-column>
                    <clr-dg-column [clrDgField]="'team'"
                      >Owning Team</clr-dg-column
                    >
                    <clr-dg-column>Number of Scenarios</clr-dg-column>
                    <clr-dg-placeholder
                      >We couldn't find any Features!</clr-dg-placeholder
                    >
                    <clr-dg-row *ngFor="let feature of features$ | async">
                      <clr-dg-cell>{{ feature.name }}</clr-dg-cell>
                      <clr-dg-cell>{{ feature.team }}</clr-dg-cell>
                      <clr-dg-cell>{{ feature.scenarios?.length }}</clr-dg-cell>
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
export class FeatureListingComponent {
  constructor(private featureService: FeatureService) {}

  features$ = this.featureService.featureWithAdd$;
}