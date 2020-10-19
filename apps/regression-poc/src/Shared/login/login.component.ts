import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginState } from './login.reducer';
import { login } from './actions/login-page.actions';

@Component({
  selector: 'qa-login',
  template: `
    <div class="login-wrapper">
      <form class="login" [formGroup]="loginForm" (ngSubmit)="login()">
        <section class="title">
          <h3 class="welcome">Welcome to</h3>
          Regression Testing
          <h5 class="hint">Use your employer provided login to begin</h5>
        </section>
        <div class="login-group">
          <clr-input-container>
            <label class="clr-sr-only">Username</label>
            <input
              type="text"
              name="username"
              clrInput
              formControlName="username"
              placeholder="Username"
            />
          </clr-input-container>
          <clr-password-container>
            <label class="clr-sr-only">Password</label>
            <input
              type="password"
              name="password"
              clrPassword
              formControlName="password"
              placeholder="Password"
            />
          </clr-password-container>
          <clr-checkbox-wrapper>
            <label>Remember me</label>
            <input type="checkbox" name="rememberMe" clrCheckbox />
          </clr-checkbox-wrapper>
          <div class="error" [ngClass]="{ active: loginError }">
            Invalid user name or password
          </div>
          <button type="submit" class="btn btn-primary">NEXT</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output()
  isLoggedIn = new EventEmitter<boolean>();

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private store:Store<LoginState>
  ) {}

  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });
  loginError = false;
  redirectUrl: string;

  login() {

this.store.dispatch(login(this.loginForm.value));


    this.loginService.login(this.loginForm.value).subscribe(
      x => {
        if (x.isLoggedIn) {
          console.log(this.redirectUrl);
          this.router.navigate([
            { outlets: { primary: 'regression', login: null } }
          ]);
        } else {
          this.loginError = true;
        }
        console.log(x);
        this.isLoggedIn.emit(x.isLoggedIn);
      },
      () => (this.loginError = true)
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => (this.redirectUrl = params['return'] || '/dashboard')
    );
  }
}
