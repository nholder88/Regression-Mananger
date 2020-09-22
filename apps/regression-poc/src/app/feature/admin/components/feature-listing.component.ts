import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../../regression/services/feature.service';
import { FeatureScenarioContainer } from '@qa/api-interfaces';

@Component({
  selector: 'qa-feature-listing',
  templateUrl: 'feature-listing.component.html'
})
export class FeatureListingComponent implements OnInit {
  constructor(private featureService: FeatureService) {}

  features$ = this.featureService.modelWithDelete$;

  deleteFeature(feature: FeatureScenarioContainer) {
    this.featureService.deleteModel(feature.id);
  }

  selectFeature(feature: FeatureScenarioContainer) {
    this.featureService.selectedModelChanged(feature.id);
  }
  ngOnInit() {
    this.featureService.selectedModelChanged(null);
  }
}
