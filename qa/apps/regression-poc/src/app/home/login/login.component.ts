import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../Shared/auth.service';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'qa-login',
  template: `
    <div class="login-wrapper">
      <form class="login" [formGroup]="loginForm" (ngSubmit)="login()">
        <section class="title">
          <h3 class="welcome">Welcome to</h3>
          Company Product Name
          <h5 class="hint">Use your Company ID to sign in or create one now</h5>
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
            <input type="checkbox" name="rememberMe" clrCheckbox/>
          </clr-checkbox-wrapper>
          <div class="error" [ngClass]=" {'active':loginError}">
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

  constructor(private authService: AuthService, private fb: FormBuilder) {
  }

  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });
  loginError = false;

  login() {
    const loginResult = this.authService.login(this.loginForm.value);
    this.isLoggedIn.emit(loginResult.isLoggedIn);
  }

  ngOnInit(): void {
  }
}
