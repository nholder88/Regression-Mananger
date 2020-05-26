import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { UserContainerComponent } from './containers/user-container.component';

import { LandingComponent } from './containers/landing.component';
import { UserFormComponent } from './components/user-form.component';
import { UserListingComponent } from './components/user-listing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatureContainerComponent } from './containers/feature-container.component';
import { ScenarioContainerComponent } from './containers/scenario-container.component';
import { FeatureFormComponent } from './components/feature-form.component';
import { ScenarioFormComponent } from './components/scenario-form.component';;
import { FeatureListingComponent } from './components/feature-listing.component';
import { ScenarioListingComponent } from './components/scenario-listing.component'

@NgModule({
  declarations: [
    LandingComponent,
    UserContainerComponent,
    UserListingComponent,
    UserFormComponent,
    FeatureContainerComponent,
    ScenarioContainerComponent,
    FeatureFormComponent,
    ScenarioFormComponent,
    FeatureListingComponent
,
    ScenarioListingComponent  ],
  imports: [
    ClarityModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: LandingComponent },
      { path: 'users', component: UserContainerComponent },
      { path: 'features', component: FeatureContainerComponent },
      { path: 'scenarios', component: ScenarioContainerComponent }
    ]),

    ReactiveFormsModule
  ],
  exports: [UserContainerComponent]
})
export class AdminModule {}
