import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegressionListingComponent } from './regression-listing/regression-listing.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { RegressionCreateComponent } from './regression-create/regression-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegressionTestPassFormComponent } from './regression-test-pass-form/regression-test-pass-form.component';
import { RegressionTestingComponent } from './regression-testing/regression-testing.component';

@NgModule({
  declarations: [
    RegressionListingComponent,
    RegressionCreateComponent,
    RegressionTestPassFormComponent,
    RegressionTestingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'history',
        component: RegressionListingComponent
      },
      { path: 'continue', component: RegressionTestingComponent }
    ]),
    ClarityModule
  ],
  exports: [RegressionListingComponent]
})
export class RegressionModule {}
