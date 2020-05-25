import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { RegressionModule } from './feature/regression/regression.module';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AdminModule } from './feature/admin/admin.module';
import { ApplicationHeaderComponent } from './home/layout/application-header.component';
import { SharedModule } from '../Shared/shared.module';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '../Shared/inteceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    ApplicationHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    ReactiveFormsModule,
    SharedModule,
    RegressionModule,
    AdminModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
