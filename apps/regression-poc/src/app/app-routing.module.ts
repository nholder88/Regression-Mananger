import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { LoginComponent } from '../Shared/login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [



  {
    path: 'regression', outlet:'app',
    loadChildren: () =>
      import('./feature/regression/regression.module').then(
        m => m.RegressionModule
      )
  },
  {
    path: 'admin',  outlet:'app',
    loadChildren: () =>
      import('./feature/admin/admin.module').then(a => a.AdminModule)
  },
  {
    path: 'dashboard',  outlet:'app',
    loadChildren: () =>
      import('./feature/reporting/reporting.module').then(r => r.ReportingModule)
  },
  {path: 'login', component:LoginComponent,  pathMatch:'full'},
  {path:'**', component:WelcomeComponent},
  { path: '**/**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
