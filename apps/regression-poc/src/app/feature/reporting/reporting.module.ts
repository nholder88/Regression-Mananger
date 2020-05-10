import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { GraphingComponent } from './components/bar-graph/graphing.component';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './containers/landing/landing.component';
import { ChartsModule } from 'ng2-charts';
import { ClarityModule, ClrSpinnerModule } from '@clr/angular';


@NgModule({
  declarations: [DatatableComponent, GraphingComponent, LandingComponent],
  imports: [
    CommonModule,
    ChartsModule,
    ClarityModule,
    RouterModule.forChild([

      {path: '', component: LandingComponent}
    ]),
    ClrSpinnerModule,
  ]
})
export class ReportingModule {
}
