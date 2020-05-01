import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegressionListingComponent } from './components/regression-listing/regression-listing.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { RegressionHeaderCreateComponent } from './components/regression-header-create/regression-header-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegressionTestPassFormComponent } from './components/regression-test-pass-form/regression-test-pass-form.component';
import { RegressionTestingComponent } from './components/regression-testing/regression-testing.component';

import { RegressionTestPassListingComponent } from './components/regression-test-pass-listing/regression-test-pass-listing.component';
import { SharedModule } from '../../../Shared/shared.module';


@NgModule({
  declarations: [
    RegressionListingComponent,
    RegressionHeaderCreateComponent,
    RegressionTestPassFormComponent,

    RegressionTestingComponent,
    RegressionTestPassListingComponent

  ],
  imports: [
    CommonModule,
    ClarityModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'history',
        component: RegressionListingComponent
      },

      { path: 'continue/:id', component: RegressionTestingComponent },
      {path: 'listing', component:RegressionTestPassListingComponent},
      {path: '', redirectTo: 'history', pathMatch:'full' }
    ]),
    SharedModule
  ],
  exports: [RegressionListingComponent]
})
export class RegressionModule {}
