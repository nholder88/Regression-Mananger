import { Component } from '@angular/core';

@Component({
  selector: 'qa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loggedIn = false;

  constructor() {
  }

  onLoginAttempt(result: boolean) {
    this.loggedIn = result;
  }
}
