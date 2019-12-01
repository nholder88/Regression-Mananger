import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegressionListingComponent } from './regression-listing/regression-listing.component';
import {RouterModule} from "@angular/router";
import {ClarityModule} from "@clr/angular";



@NgModule({
  declarations: [RegressionListingComponent],
  imports: [
    CommonModule, RouterModule.forChild([{
      path: '', component: RegressionListingComponent
    }]), ClarityModule
  ],
  exports:[RegressionListingComponent]
})
export class RegressionModule { }
