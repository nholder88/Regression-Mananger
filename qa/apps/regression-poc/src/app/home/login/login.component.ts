import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-login',
  template: `
    <div class="login-wrapper">
      <form class="login">
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
              placeholder="Username"
            />
          </clr-input-container>
          <clr-password-container>
            <label class="clr-sr-only">Password</label>
            <input
              type="password"
              name="password"
              clrPassword
              placeholder="Password"
            />
          </clr-password-container>
          <clr-checkbox-wrapper>
            <label>Remember me</label>
            <input type="checkbox" name="rememberMe" clrCheckbox />
          </clr-checkbox-wrapper>
          <div class="error active">
            Invalid user name or password
          </div>
          <button type="submit" class="btn btn-primary">NEXT</button>
          <a href="javascript://" class="signup">Sign up for a Company ID</a>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
