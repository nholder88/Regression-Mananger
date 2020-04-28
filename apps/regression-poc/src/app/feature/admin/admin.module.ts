import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { UserContainerComponent } from './user/user-container.component';

import { LandingComponent } from './landing.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserListingComponent } from './user/user-listing/user-listing.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LandingComponent,
    UserContainerComponent,
    UserListingComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: LandingComponent },
      { path: 'users', component: UserContainerComponent }
    ]),

    ReactiveFormsModule,
  ],
  exports: [UserContainerComponent]
})
export class AdminModule {}
