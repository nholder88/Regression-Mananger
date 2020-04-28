import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@qa/api-interfaces';

@Component({
  selector: 'qa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loggedIn = false;

  constructor(private http: HttpClient) {
  }

  onLoginAttempt(result: boolean) {
    this.loggedIn = result;
  }
}
