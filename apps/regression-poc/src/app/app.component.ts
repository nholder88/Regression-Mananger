import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Shared/services/login.service';

@Component({
  selector: 'qa-root',
  template: `<router-outlet name="login"> </router-outlet>
  <div class="main-container" *ngIf="loggedIn$ | async">
    <div class="alert alert-app-level"></div>
    <qa-application-header></qa-application-header>
    <div class="content-container">
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `

})
export class AppComponent implements OnInit {
  loggedIn$ = this.loginService.LoggedOn$;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.isUserLoggedIn();
  }
}
