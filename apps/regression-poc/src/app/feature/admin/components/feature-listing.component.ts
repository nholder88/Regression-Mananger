import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../../regression/services/feature.service';
import { FeatureScenarioContainer } from '@qa/api-interfaces';
import { race } from 'rxjs';

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
                    <clr-dg-column></clr-dg-column>
                    <clr-dg-placeholder
                      >We couldn't find any Features!</clr-dg-placeholder
                    >
                    <clr-dg-row *ngFor="let feature of features$ | async">
                      <clr-dg-cell>{{ feature.name }}</clr-dg-cell>
                      <clr-dg-cell>{{ feature.team }}</clr-dg-cell>
                      <clr-dg-cell>{{ feature.scenarios?.length }}</clr-dg-cell>
                      <clr-dg-cell>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          (click)="deleteFeature(feature)"
                          [disabled]="feature.scenarios?.length > 0"
                        >
                          <clr-icon shape="trash"></clr-icon>
                          Remove
                        </button></clr-dg-cell
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
export class FeatureListingComponent {
  constructor(private featureService: FeatureService) {}

  features$ = race(
    this.featureService.featureWithDelete$,
    this.featureService.featureWithAdd$
  );
  deleteFeature(feature: FeatureScenarioContainer) {
    this.featureService.deleteFeature(feature.id);
  }
}
