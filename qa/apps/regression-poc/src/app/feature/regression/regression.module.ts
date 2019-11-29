import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegressionListingComponent } from './regression-listing/regression-listing.component';



@NgModule({
  declarations: [RegressionListingComponent],
  imports: [
    CommonModule
  ],
  exports:[RegressionListingComponent]
})
export class RegressionModule { }
