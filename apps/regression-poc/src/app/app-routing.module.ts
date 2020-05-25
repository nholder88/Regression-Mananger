import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { LoginComponent } from '../Shared/login/login.component';
import { AuthGuard } from '../Shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'regression',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./feature/regression/regression.module').then(
        m => m.RegressionModule
      )
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./feature/admin/admin.module').then(a => a.AdminModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./feature/reporting/reporting.module').then(
        r => r.ReportingModule
      )
  },
  { path: 'login', outlet: 'primary', component: WelcomeComponent },
  { path: 'login', outlet: 'login', component: LoginComponent },
  {
    path: '**',
    loadChildren: () =>
      import('./feature/reporting/reporting.module').then(
        r => r.ReportingModule
      ),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
