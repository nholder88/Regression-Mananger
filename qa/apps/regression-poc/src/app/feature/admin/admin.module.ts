import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ClarityModule} from "@clr/angular";

;
import {UserComponent} from './user/user.component'
  ;
import {LandingComponent} from './landing.component'

@NgModule({
  declarations: [UserComponent, LandingComponent],
  imports: [
    CommonModule, RouterModule.forChild([{path: '', component: LandingComponent},
      {path: "users", component: UserComponent}]),
    ClarityModule
  ],
  exports: [UserComponent]
})
export class AdminModule {
}
