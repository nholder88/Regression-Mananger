import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ApplicationHeaderComponent } from '../app/home/layout/application-header.component';
import { LoginComponent } from './login/login.component';
import { AsyncFormModelDirective } from './directives/async-form-model.directive';



@NgModule({
  declarations: [
    LoginComponent,
    AsyncFormModelDirective],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, ClarityModule
  ]
})
export class SharedModule { }
