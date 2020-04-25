import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { RegressionModule } from './feature/regression/regression.module';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AdminModule } from './feature/admin/admin.module';
import { ApplicationHeaderComponent } from './home/layout/application-header.component';
import { LoginComponent } from './home/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    ApplicationHeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RegressionModule,
    AdminModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
