import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatableComponent} from './components/datatable/datatable.component';
import {BarGraphComponent} from './components/bar-graph/bar-graph.component';
import {RouterModule} from "@angular/router";
import {LandingComponent} from './containers/landing/landing.component';
import {ChartsModule} from "ng2-charts";
import {ClrSpinnerModule} from "@clr/angular";


@NgModule({
  declarations: [DatatableComponent, BarGraphComponent, LandingComponent],
  imports: [
    CommonModule,
    ChartsModule,
    RouterModule.forChild([

      {path: '', component: LandingComponent}
    ]),
    ClrSpinnerModule,
  ]
})
export class ReportingModule {
}
