import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegressionListingComponent} from './regression-listing/regression-listing.component';
import {RouterModule} from "@angular/router";
import {ClarityModule} from "@clr/angular";
import { RegressionCreateComponent } from './regression-create/regression-create.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [RegressionListingComponent, RegressionCreateComponent],
  imports: [
    CommonModule, ReactiveFormsModule,RouterModule.forChild([{
      path: 'history', component: RegressionListingComponent
    },
      {path:'plan', component: RegressionCreateComponent}]), ClarityModule
  ],
  exports: [RegressionListingComponent]
})
export class RegressionModule {
}
