import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { LoginComponent } from './login/login.component';
import { AsyncFormModelDirective } from './directives/async-form-model.directive';

import * as fromLogin from './login/login.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [LoginComponent, AsyncFormModelDirective],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    StoreModule.forFeature('Login', fromLogin.reducer)
  ]
})
export class SharedModule {}
