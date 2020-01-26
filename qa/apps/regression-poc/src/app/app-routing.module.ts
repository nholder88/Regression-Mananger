import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegressionListingComponent } from './feature/regression/regression-listing/regression-listing.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'regression',
    loadChildren: () =>
      import('./feature/regression/regression.module').then(
        m => m.RegressionModule
      )
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./feature/admin/admin.module').then(a => a.AdminModule)
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
